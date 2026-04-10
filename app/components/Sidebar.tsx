"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6 self-start">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#135156]">
        Sidebar
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight">Navigasi</h2>
      <div className="mt-6 grid gap-3">
        <Link
          href="/dashboard"
          className={`rounded-3xl px-5 py-4 text-left transition-all ${
            pathname.startsWith("/dashboard")
              ? "bg-[#135156] text-white shadow-lg shadow-[rgba(19,81,86,0.3)]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <p className="font-black">Dashboard</p>
          <p
            className={`mt-1 text-sm ${
              pathname.startsWith("/dashboard")
                ? "text-[rgba(240,248,248,0.9)]"
                : "text-slate-500"
            }`}
          >
            Saldo BS, pemasukan, dan pengeluaran.
          </p>
        </Link>
        <Link
          href="/history"
          className={`rounded-3xl px-5 py-4 text-left transition-all ${
            pathname.startsWith("/history")
              ? "bg-[#135156] text-white shadow-lg shadow-[rgba(19,81,86,0.3)]"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <p className="font-black">Riwayat Transaksi</p>
          <p
            className={`mt-1 text-sm ${
              pathname.startsWith("/history")
                ? "text-[rgba(240,248,248,0.9)]"
                : "text-slate-500"
            }`}
          >
            Semua riwayat dan filter per tanggal.
          </p>
        </Link>
      </div>
    </aside>
  );
}
