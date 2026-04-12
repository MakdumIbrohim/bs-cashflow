"use client";

import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn, setUser, showToast } = useAppContext();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Username dan password harus diisi.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json()) as {
        error?: string;
        user?: Parameters<typeof setUser>[0];
      };

      if (!res.ok) {
        throw new Error(data.error || "Login gagal.");
      }
      if (!data.user) {
        throw new Error("Data user tidak ditemukan.");
      }

      // which auto-saves to localStorage
      setUser(data.user);
      setIsLoggedIn(true);
      showToast("Berhasil masuk ke Dashboard!", "success");
      router.push("/dashboard");

    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoggedIn) return null; // Or a loader while redirecting

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <section className="relative grid min-h-screen place-items-center px-6 py-10">
        {/* Abstract background elements */}
        <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-[rgba(19,81,86,0.18)] blur-3xl" />
        <div className="absolute -right-20 bottom-4 h-96 w-96 rounded-full bg-[rgba(19,81,86,0.12)] blur-3xl" />

        <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex min-h-[520px] flex-col justify-between bg-[#0b3235] p-8 text-white sm:p-12">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#8ec3c7]">
                  BSC Cashflow
                </p>
                <h1 className="mt-10 max-w-xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
                  Pantau uang BS tanpa ribet.
                </h1>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <p className="text-sm uppercase tracking-[0.25em] text-[#8ec3c7]">
                  Akses internal
                </p>
                <p className="mt-3 text-lg leading-relaxed text-[rgba(240,248,248,0.82)]">
                  Masuk dengan username dan password untuk langsung menuju halaman utama pengelolaan saldo.
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-12">
              <div className="mb-10">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#135156]">
                  Login
                </p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
                  Selamat datang.
                </h2>
                <p className="mt-3 text-slate-500">
                  Tidak ada pembuatan akun baru di halaman ini.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleLogin}>
                <label className="block">
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                    Username
                  </span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-[#135156] focus:ring-4 focus:ring-[rgba(19,81,86,0.15)]"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                    Password
                  </span>
                  <input
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-[#135156] focus:ring-4 focus:ring-[rgba(19,81,86,0.15)]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Masukkan password"
                    type="password"
                    autoComplete="current-password"
                  />
                </label>

                {errorMsg && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-600">
                    {errorMsg}
                  </div>
                )}

                <button 
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#135156] px-5 py-4 text-lg font-black text-white shadow-lg shadow-[rgba(19,81,86,0.25)] transition-all hover:-translate-y-1 hover:bg-[#0f4347] hover:shadow-[rgba(19,81,86,0.3)] focus:outline-none focus:ring-4 focus:ring-[rgba(19,81,86,0.25)] disabled:opacity-50 disabled:hover:translate-y-0"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
