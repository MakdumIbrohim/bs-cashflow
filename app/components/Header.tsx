"use client";

import React from "react";
import { formatRupiah } from "../lib/utils";
import { useAppContext } from "../context/AppContext";

export function Header() {
  const { balance } = useAppContext();

  return (
    <header className="overflow-hidden rounded-[2rem] bg-emerald-950 text-white shadow-2xl shadow-emerald-900/10 mb-8">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_380px] lg:p-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
            BSC Cashflow
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Dashboard kas BS
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50/80">
            Kelola pemasukan dan pengeluaran, lalu lihat saldo akhir BS berubah otomatis setiap transaksi disimpan.
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
            Saldo BS
          </p>
          <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            {formatRupiah(balance)}
          </p>
          <p className="mt-3 text-sm text-emerald-50/60">Total kekayaan BS saat ini</p>
        </div>
      </div>
    </header>
  );
}
