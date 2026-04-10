"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import { formatRupiah, formatDate, formatMonth } from "../lib/utils";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FormTitle } from "../components/FormComponents";

export default function HistoryPage() {
  const router = useRouter();
  const { isLoggedIn, transactions, isTransactionsLoading, transactionError } =
    useAppContext();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const [historyYearFilter, setHistoryYearFilter] = useState("");
  const [historyMonthFilter, setHistoryMonthFilter] = useState("");
  const [historyDayFilter, setHistoryDayFilter] = useState("");

  const uniqueTransactionYears = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((transaction) => transaction.date.slice(0, 4))),
      ).sort((a, b) => Number(b) - Number(a)),
    [transactions],
  );

  const availableMonths = useMemo(() => {
    if (!historyYearFilter) return [];
    return Array.from(
      new Set(
        transactions
          .filter((transaction) => transaction.date.startsWith(historyYearFilter))
          .map((transaction) => transaction.date.slice(0, 7)),
      ),
    ).sort((a, b) => b.localeCompare(a));
  }, [historyYearFilter, transactions]);

  const availableDays = useMemo(() => {
    if (!historyMonthFilter) return [];
    return Array.from(
      new Set(
        transactions
          .filter((transaction) => transaction.date.startsWith(historyMonthFilter))
          .map((transaction) => transaction.date),
      ),
    ).sort((a, b) => b.localeCompare(a));
  }, [historyMonthFilter, transactions]);

  const filteredTransactions = useMemo(() => {
    let currentTransactions = transactions;

    if (historyYearFilter) {
      currentTransactions = currentTransactions.filter((transaction) =>
        transaction.date.startsWith(historyYearFilter)
      );
    }
    if (historyMonthFilter) {
      currentTransactions = currentTransactions.filter((transaction) =>
        transaction.date.startsWith(historyMonthFilter)
      );
    }
    if (historyDayFilter) {
      currentTransactions = currentTransactions.filter(
        (transaction) => transaction.date === historyDayFilter
      );
    }
    return currentTransactions;
  }, [historyDayFilter, historyMonthFilter, historyYearFilter, transactions]);

  function resetHistoryFilters() {
    setHistoryYearFilter("");
    setHistoryMonthFilter("");
    setHistoryDayFilter("");
  }
  function selectHistoryYear(year: string) {
    setHistoryYearFilter(year);
    setHistoryMonthFilter("");
    setHistoryDayFilter("");
  }
  function selectHistoryMonth(month: string) {
    setHistoryMonthFilter(month);
    setHistoryDayFilter("");
  }

  if (!isLoggedIn) return null; // Or loading spinner

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Header />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
            <FormTitle
              eyebrow="Riwayat"
              title="Riwayat Transaksi"
              description="Lihat semua transaksi, lalu persempit berdasarkan tahun, bulan, dan hari."
            />
            <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Semua riwayat
                </p>
                <button
                  type="button"
                  className={`mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                    historyYearFilter === "" &&
                    historyMonthFilter === "" &&
                    historyDayFilter === ""
                      ? "border-slate-900 bg-slate-900 text-white shadow-md shadow-slate-900/20"
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                  }`}
                  onClick={resetHistoryFilters}
                >
                  Tampilkan semua transaksi
                </button>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Tahun
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {uniqueTransactionYears.map((year) => (
                    <button
                      type="button"
                      className={`rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                        historyYearFilter === year
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                      }`}
                      key={year}
                      onClick={() => selectHistoryYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Bulan
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {availableMonths.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Pilih tahun terlebih dahulu.
                    </p>
                  ) : (
                    availableMonths.map((month) => (
                      <button
                        type="button"
                        className={`rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                          historyMonthFilter === month
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                        }`}
                        key={month}
                        onClick={() => selectHistoryMonth(month)}
                      >
                        {formatMonth(month)}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                  Hari
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {availableDays.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      Pilih bulan terlebih dahulu.
                    </p>
                  ) : (
                    availableDays.map((day) => (
                      <button
                        type="button"
                        className={`rounded-2xl border px-4 py-3 text-sm font-black transition-all ${
                          historyDayFilter === day
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
                        }`}
                        key={day}
                        onClick={() => setHistoryDayFilter(day)}
                      >
                        {formatDate(day)}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {isTransactionsLoading ? (
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                  Memuat riwayat transaksi dari Google Apps Script...
                </p>
              ) : transactionError ? (
                <p className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-800">
                  {transactionError}
                </p>
              ) : transactions.length === 0 ? (
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                  Belum ada transaksi. Simpan pemasukan atau pengeluaran pertama
                  untuk mulai membentuk saldo BS.
                </p>
              ) : filteredTransactions.length === 0 ? (
                <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-500">
                  Tidak ada transaksi pada tanggal yang dipilih.
                </p>
              ) : (
                filteredTransactions.map((transaction) => (
                  <article
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                    key={transaction.id}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-black ${
                            transaction.type === "pemasukan"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          {transaction.type === "pemasukan" ? "+" : "-"}
                        </div>
                        <div>
                        <p className="font-black text-slate-900">{transaction.title}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize text-slate-600">
                            {transaction.type}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                            {formatDate(transaction.date)}
                          </span>
                        </div>
                      </div>
                      </div>
                      <p
                        className={`text-lg font-black ${
                          transaction.type === "pemasukan"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}
                      >
                        {transaction.type === "pemasukan" ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-slate-500">
                      Saldo akhir: {formatRupiah(transaction.balanceAfter)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
