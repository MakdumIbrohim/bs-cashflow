"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import { formatRupiah, formatDate, formatMonth } from "../lib/utils";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { FormTitle, SelectInput } from "../components/FormComponents";

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

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const availableYears = useMemo(() => {
    const years = [];
    for (let y = currentYear; y >= 2025; y--) {
      years.push(String(y));
    }
    return years;
  }, [currentYear]);

  const availableMonths = useMemo(() => {
    if (!historyYearFilter) return [];
    
    const isCurrentYear = historyYearFilter === String(currentYear);
    const maxMonth = isCurrentYear ? currentMonth : 12;

    const months = [];
    for (let m = maxMonth; m >= 1; m--) {
      months.push(`${historyYearFilter}-${String(m).padStart(2, "0")}`);
    }
    return months;
  }, [historyYearFilter, currentYear, currentMonth]);

  const availableDays = useMemo(() => {
    if (!historyMonthFilter) return [];
    
    const [yearStr, monthStr] = historyMonthFilter.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    const isCurrentMonth = year === currentYear && month === currentMonth;
    const daysInMonth = new Date(year, month, 0).getDate();
    const maxDay = isCurrentMonth ? currentDay : daysInMonth;

    const days = [];
    for (let d = maxDay; d >= 1; d--) {
      days.push(`${historyMonthFilter}-${String(d).padStart(2, "0")}`);
    }
    return days;
  }, [historyMonthFilter, currentYear, currentMonth, currentDay]);

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
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <SelectInput
                label="Tahun"
                value={historyYearFilter}
                onChange={selectHistoryYear}
                placeholder="Semua Tahun"
                options={availableYears.map((year) => ({ label: year, value: year }))}
              />
              <SelectInput
                label="Bulan"
                value={historyMonthFilter}
                onChange={selectHistoryMonth}
                placeholder={historyYearFilter ? "Semua Bulan" : "Pilih tahun dulu"}
                options={availableMonths.map((month) => ({ label: formatMonth(month), value: month }))}
                disabled={!historyYearFilter}
              />
              <SelectInput
                label="Tanggal (Hari)"
                value={historyDayFilter}
                onChange={setHistoryDayFilter}
                placeholder={historyMonthFilter ? "Semua Tanggal" : "Pilih bulan dulu"}
                options={availableDays.map((day) => ({ label: formatDate(day), value: day }))}
                disabled={!historyMonthFilter}
              />
              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg font-black text-slate-700 shadow-sm transition-all hover:bg-slate-100 disabled:opacity-50"
                  onClick={resetHistoryFilters}
                  disabled={!historyYearFilter && !historyMonthFilter && !historyDayFilter}
                >
                  Reset Filter
                </button>
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
