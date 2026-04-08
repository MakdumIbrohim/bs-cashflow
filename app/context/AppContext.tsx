"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initialTransactions, Transaction, IncomeForm, ExpenseForm } from "../lib/types";

interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  transactions: Transaction[];
  addIncome: (income: IncomeForm, incomeTotal: number) => void;
  addExpense: (expense: ExpenseForm, expenseTotal: number) => void;
  balance: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  useEffect(() => {
    setIsMounted(true);
    const savedLogin = localStorage.getItem("bs_isLoggedIn");
    if (savedLogin) setIsLoggedIn(JSON.parse(savedLogin));

    const savedTransactions = localStorage.getItem("bs_transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("bs_isLoggedIn", JSON.stringify(isLoggedIn));
      localStorage.setItem("bs_transactions", JSON.stringify(transactions));
    }
  }, [isLoggedIn, transactions, isMounted]);

  const balance = transactions.length > 0 ? transactions[0].balanceAfter : 0;

  const addIncome = (income: IncomeForm, incomeTotal: number) => {
    const nextBalance = balance + incomeTotal;
    setTransactions((current) => [
      {
        id: Date.now(),
        type: "pemasukan",
        date: income.tanggal,
        title: income.namaMenu,
        amount: incomeTotal,
        balanceAfter: nextBalance,
      },
      ...current,
    ]);
  };

  const addExpense = (expense: ExpenseForm, expenseTotal: number) => {
    const nextBalance = balance - expenseTotal;
    setTransactions((current) => [
      {
        id: Date.now(),
        type: "pengeluaran",
        date: expense.tanggal,
        title: expense.keterangan,
        amount: expenseTotal,
        balanceAfter: nextBalance,
      },
      ...current,
    ]);
  };

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        transactions,
        addIncome,
        addExpense,
        balance,
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
