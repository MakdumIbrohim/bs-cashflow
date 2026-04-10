"use client";

import React from "react";
import { formatRupiah } from "../lib/utils";
import { useAppContext } from "../context/AppContext";
export function Header() {
  const { balance, user, setIsLoggedIn, setUser, showToast } = useAppContext();

  function logout() {
    setIsLoggedIn(false);
    setUser(null);
    showToast("Berhasil logout", "info");
  }

  return (
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
        <div className="mt-6 sm:mt-0 flex gap-4 items-center self-start">
          {user && (
            <div className="text-right">
              <p className="font-bold">{user.nama_lengkap || user.username}</p>
              <p className="text-sm text-emerald-400 capitalize">{user.role}</p>
            </div>
          )}
          <button 
            onClick={logout}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md transition-colors hover:bg-white/20"
          >
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
  );
}
