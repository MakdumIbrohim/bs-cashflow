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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMode, setExportMode] = useState<"all" | "filtered">("filtered");

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
    if (!historyYearFilter && !historyMonthFilter && !historyDayFilter) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      // Ubah string UTC Google Apps Script ke tanggal lokal untuk mencocokkan filter browser
      const d = new Date(transaction.date);
      let localString = transaction.date;
      
      if (!isNaN(d.getTime())) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        localString = `${y}-${m}-${day}`;
      }

      if (historyDayFilter) {
        return localString === historyDayFilter;
      }
      if (historyMonthFilter) {
        return localString.startsWith(historyMonthFilter);
      }
      if (historyYearFilter) {
        return localString.startsWith(historyYearFilter);
      }
      return true;
    });
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

  if (!isLoggedIn) return null;

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10 print:hidden">
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
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm sm:text-base font-black text-slate-700 shadow-sm transition-all hover:bg-slate-100 disabled:opacity-50"
                  onClick={resetHistoryFilters}
                  disabled={!historyYearFilter && !historyMonthFilter && !historyDayFilter}
                >
                  Reset Filter
                </button>
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm sm:text-base font-black text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
                  onClick={() => setIsExportModalOpen(true)}
                  disabled={transactions.length === 0}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Ekspor PDF
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

      {/* Modal Ekspor PDF */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsExportModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900">Pengaturan Cetak PDF</h2>
            <p className="mt-2 text-slate-500">Pilih rentang data transaksi yang ingin Anda cetak.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <label className={`flex cursor-pointer border-2 items-center gap-4 rounded-xl p-4 transition-all ${exportMode === 'filtered' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <input type="radio" name="exportMode" value="filtered" checked={exportMode === "filtered"} onChange={() => setExportMode("filtered")} className="h-5 w-5 accent-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900">Sesuai Tampilan ({filteredTransactions.length} transaksi)</p>
                  <p className="text-sm text-slate-500">Mencetak rekap sesuai dengan filter Tahun/Bulan/Hari yang sedang aktif sekarang.</p>
                </div>
              </label>

              <label className={`flex cursor-pointer border-2 items-center gap-4 rounded-xl p-4 transition-all ${exportMode === 'all' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                <input type="radio" name="exportMode" value="all" checked={exportMode === "all"} onChange={() => setExportMode("all")} className="h-5 w-5 accent-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900">Semua Data ({transactions.length} transaksi)</p>
                  <p className="text-sm text-slate-500">Mencetak catatan seluruh kas dari awal aplikasi digunakan tanpa terlewat.</p>
                </div>
              </label>
            </div>

            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setIsExportModalOpen(false)} className="w-full rounded-2xl bg-slate-100 py-3.5 font-bold text-slate-700 hover:bg-slate-200">Batal</button>
              <button 
                type="button"
                onClick={() => {
                  setIsExportModalOpen(false);
                  setTimeout(() => window.print(), 300); // Tunggu modal hilang sebelum memanggil print dialog agar backdrop hilang
                }} 
                className="w-full rounded-2xl bg-emerald-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:bg-emerald-700 transition"
              >
                Cetak / Simpan PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tampilan Cetak Khusus (Hanya muncul di dalam dokumen PDF / Printer) */}
      <div className="hidden print:block fixed inset-0 z-[9999] bg-white p-8 font-sans">
        <div className="border-b-[3px] border-black pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase text-black">Laporan Transaksi Kas BS Cashflow</h1>
          <p className="text-black text-sm mt-1">Dicetak pada: {formatDate(new Date().toISOString())} — Filter: {exportMode === 'all' ? 'Semua Waktu' : 'Disaring'}</p>
        </div>
        
        <table className="w-full text-left border-collapse border border-black text-sm">
          <thead>
            <tr>
              <th className="border border-black p-3 bg-gray-200 font-bold text-black uppercase">Tanggal</th>
              <th className="border border-black p-3 bg-gray-200 font-bold text-black uppercase">Keterangan</th>
              <th className="border border-black p-3 bg-gray-200 font-bold text-black uppercase">Tipe</th>
              <th className="border border-black p-3 bg-gray-200 font-bold text-black uppercase text-right">Nominal</th>
              <th className="border border-black p-3 bg-gray-200 font-bold text-black uppercase text-right">Saldo Kas</th>
            </tr>
          </thead>
          <tbody>
            {(exportMode === "all" ? transactions : filteredTransactions).map((tx) => (
              <tr key={tx.id}>
                <td className="border border-black p-3 whitespace-nowrap text-black">{formatDate(tx.date)}</td>
                <td className="border border-black p-3 text-black font-medium">{tx.title}</td>
                <td className="border border-black p-3 text-black capitalize">{tx.type}</td>
                <td className="border border-black p-3 text-right whitespace-nowrap font-bold" style={{ color: tx.type === 'pemasukan' ? '#047857' : '#be123c' }}>
                  {tx.type === 'pemasukan' ? '+ ' : '- '} {formatRupiah(tx.amount)}
                </td>
                <td className="border border-black p-3 text-right font-bold text-black whitespace-nowrap">{formatRupiah(tx.balanceAfter)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-10 text-center text-xs text-black italic border-t border-black pt-4">
          Dokumen digenerate secara otomatis oleh sistem BS Cashflow.
        </div>
      </div>
    </>
  );
}
