"use client";

import React from "react";
import { formatRupiah } from "../lib/utils";
import { useAppContext } from "../context/AppContext";
export function Header() {
  const { balance, user, setIsLoggedIn, setUser, showToast } = useAppContext();

  function logout() {
    setIsLoggedIn(false);
    setUser(null);
    showToast("Berhasil logout", "success");
  }

  return (
    <>
      <div className="sm:hidden mb-6 flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
        {user && (
          <div>
            <p className="font-bold text-slate-900">{user.nama_lengkap || user.username}</p>
            <p className="text-sm font-medium text-emerald-600 capitalize">{user.role}</p>
          </div>
        )}
        <button 
          onClick={logout}
          className="flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-black text-rose-600 transition-colors hover:bg-rose-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Keluar
        </button>
      </div>

      <header className="overflow-hidden rounded-[2rem] bg-emerald-950 text-white shadow-2xl shadow-emerald-900/10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between p-6 sm:p-8 lg:p-10 pb-0 sm:pb-0 lg:pb-0">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
              BSC Cashflow
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
              {user ? `Halo, ${user.nama_lengkap ? user.nama_lengkap.split(" ")[0] : user.username}!` : "Dashboard kas BS"}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50/80">
              Kelola pemasukan dan pengeluaran, lalu lihat saldo akhir BS berubah otomatis setiap transaksi disimpan.
            </p>
          </div>
          <div className="hidden sm:flex gap-4 items-center self-start">
            {user && (
              <div className="text-right">
                <p className="font-bold">{user.nama_lengkap || user.username}</p>
                <p className="text-sm text-emerald-400 capitalize">{user.role}</p>
              </div>
            )}
            <button 
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 backdrop-blur-md transition-colors hover:bg-rose-500/40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Keluar
            </button>
          </div>
        </div>
        <div className="p-6 sm:p-8 lg:p-10 pt-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:w-96">
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
    </>
  );
}
