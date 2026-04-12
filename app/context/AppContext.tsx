"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Transaction,
  IncomeForm,
  ExpenseForm,
  CreateTransactionInput,
} from "../lib/types";

export interface User {
  id: string | number;
  username: string;
  nama_lengkap: string;
  role: string;
}

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  transactions: Transaction[];
  addIncome: (income: IncomeForm, incomeTotal: number) => Promise<void>;
  addExpense: (expense: ExpenseForm, expenseTotal: number) => Promise<void>;
  balance: number;
  isTransactionsLoading: boolean;
  transactionError: string;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [transactionError, setTransactionError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = React.useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const savedLogin = localStorage.getItem("bs_isLoggedIn");
    if (savedLogin) setIsLoggedIn(JSON.parse(savedLogin));

    const savedUser = localStorage.getItem("bs_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setIsTransactionsLoading(true);
        setTransactionError("");

        const response = await fetch("/api/transactions", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Tidak bisa mengambil data transaksi.");
        }

        const payload = (await response.json()) as { transactions?: Transaction[] };
        setTransactions(payload.transactions ?? []);
      } catch (error) {
        setTransactionError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat mengambil transaksi.",
        );
      } finally {
        setIsTransactionsLoading(false);
      }
    }

    loadTransactions();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("bs_isLoggedIn", JSON.stringify(isLoggedIn));
      localStorage.setItem("bs_user", JSON.stringify(user));
    }
  }, [isLoggedIn, user, isMounted]);

  const balance = transactions.length > 0 ? transactions[0].balanceAfter : 0;

  async function createTransaction(input: CreateTransactionInput) {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error("Tidak bisa menyimpan transaksi.");
    }

    const payload = (await response.json()) as { transaction?: Transaction };
    const nextBalance =
      input.type === "pemasukan" ? balance + input.amount : balance - input.amount;

    const returnedTx = payload.transaction;
    if (returnedTx && !returnedTx.balanceAfter) {
      // API secara default akan mereturn 0 karena POST API hanya tau 1 row tersebut.
      // Jadi kita hitung manual untuk cache lokal.
      returnedTx.balanceAfter = nextBalance;
    }

    const fallbackTransaction: Transaction = {
      id: Date.now(),
      type: input.type,
      date: input.date,
      title: input.title,
      amount: input.amount,
      balanceAfter: nextBalance,
      category: input.kategori,
      unit: input.unit,
      unitPrice:
        typeof input.harga_satuan === "number"
          ? input.harga_satuan
          : Number(String(input.harga_satuan ?? "").replace(/[^0-9.-]/g, "")) || 0,
    };

    setTransactionError("");
    setTransactions((current) => [returnedTx ?? fallbackTransaction, ...current]);
  }

  const addIncome = async (income: IncomeForm, incomeTotal: number) => {
    await createTransaction({
      type: "pemasukan",
      date: income.tanggal,
      title: income.namaMenu,
      amount: incomeTotal,
      kategori: income.kategori,
      unit: income.unit,
      harga_satuan: income.hargaSatuan,
    });
  };

  const addExpense = async (expense: ExpenseForm, expenseTotal: number) => {
    await createTransaction({
      type: "pengeluaran",
      date: expense.tanggal,
      title: expense.keterangan,
      amount: expenseTotal,
      unit: expense.unit,
      harga_satuan: expense.hargaSatuan,
      kategori: "Operasional", // Atau default jika tidak ada kategori di ExpenseForm
    });
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        transactions,
        addIncome,
        addExpense,
        balance,
        isTransactionsLoading,
        transactionError,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed top-4 left-1/2 w-[92%] max-w-md -translate-x-1/2 sm:left-auto sm:right-6 sm:top-auto sm:bottom-6 sm:w-auto sm:translate-x-0 z-50 animate-in slide-in-from-top-5 sm:slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 sm:px-6 shadow-2xl backdrop-blur-md border ${
            toast.type === "success" ? "border-[rgba(19,81,86,0.18)] bg-[rgba(19,81,86,0.08)] text-[#135156] shadow-[rgba(19,81,86,0.1)]" :
            toast.type === "error" ? "bg-rose-50/90 border-rose-200 text-rose-800 shadow-rose-900/10" :
            "bg-blue-50/90 border-blue-200 text-blue-800 shadow-blue-900/10"
          }`}>
            <div className={`grid h-8 w-8 place-items-center rounded-full ${
              toast.type === "success" ? "bg-[rgba(19,81,86,0.14)]" :
              toast.type === "error" ? "bg-rose-200/50" :
              "bg-blue-200/50"
            }`}>
              {toast.type === "success" && (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              )}
              {toast.type === "error" && (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
              {toast.type === "info" && (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
            <p className="font-bold">{toast.message}</p>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
