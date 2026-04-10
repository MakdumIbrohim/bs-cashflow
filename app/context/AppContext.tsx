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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [transactionError, setTransactionError] = useState("");

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
      }}
    >
      {children}
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
