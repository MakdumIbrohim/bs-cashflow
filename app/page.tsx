"use client";

import { FormEvent, useMemo, useState } from "react";

type Menu = "pemasukan" | "pengeluaran";

type IncomeForm = {
  namaMenu: string;
  kategori: string;
  hargaSatuan: string;
  unit: string;
  hargaTotal: string;
};

type ExpenseForm = {
  keterangan: string;
  unit: string;
  hargaSatuan: string;
  totalHarga: string;
};

type Transaction = {
  id: number;
  type: Menu;
  title: string;
  amount: number;
  balanceAfter: number;
};

const emptyIncome: IncomeForm = {
  namaMenu: "",
  kategori: "",
  hargaSatuan: "",
  unit: "",
  hargaTotal: "",
};

const emptyExpense: ExpenseForm = {
  keterangan: "",
  unit: "",
  hargaSatuan: "",
  totalHarga: "",
};

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const parseMoney = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeMenu, setActiveMenu] = useState<Menu>("pemasukan");
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState<IncomeForm>(emptyIncome);
  const [expense, setExpense] = useState<ExpenseForm>(emptyExpense);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const incomeTotal = parseMoney(income.hargaTotal);
  const expenseTotal = parseMoney(expense.totalHarga);

  const incomeBalanceAfter = useMemo(
    () => balance + incomeTotal,
    [balance, incomeTotal],
  );

  const expenseBalanceAfter = useMemo(
    () => balance - expenseTotal,
    [balance, expenseTotal],
  );

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsLoggedIn(true);
  }

  function saveIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!income.namaMenu.trim() || incomeTotal <= 0) {
      return;
    }

    const nextBalance = balance + incomeTotal;
    setBalance(nextBalance);
    setTransactions((current) => [
      {
        id: Date.now(),
        type: "pemasukan",
        title: income.namaMenu,
        amount: incomeTotal,
        balanceAfter: nextBalance,
      },
      ...current,
    ]);
    setIncome(emptyIncome);
  }

  function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expense.keterangan.trim() || expenseTotal <= 0) {
      return;
    }

    const nextBalance = balance - expenseTotal;
    setBalance(nextBalance);
    setTransactions((current) => [
      {
        id: Date.now(),
        type: "pengeluaran",
        title: expense.keterangan,
        amount: expenseTotal,
        balanceAfter: nextBalance,
      },
      ...current,
    ]);
    setExpense(emptyExpense);
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f5efe3] text-[#251a12]">
        <section className="relative grid min-h-screen place-items-center px-6 py-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#e8b04b]/40 blur-3xl" />
          <div className="absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-[#2f7d6d]/30 blur-3xl" />
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[#251a12]/10 bg-[#fffaf0]/85 shadow-2xl shadow-[#251a12]/15 backdrop-blur">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex min-h-[520px] flex-col justify-between bg-[#243b35] p-8 text-[#fffaf0] sm:p-12">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f4c86a]">
                    BSC Cashflow
                  </p>
                  <h1 className="mt-10 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl">
                    Pantau uang BS tanpa ribet.
                  </h1>
                </div>
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#f4c86a]">
                    Akses internal
                  </p>
                  <p className="mt-3 text-lg leading-8 text-white/80">
                    Masuk dengan username dan password untuk langsung menuju
                    halaman utama pengelolaan saldo.
                  </p>
                </div>
              </div>

              <div className="p-8 sm:p-12">
                <div className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#2f7d6d]">
                    Login
                  </p>
                  <h2 className="mt-3 text-4xl font-black tracking-[-0.05em]">
                    Selamat datang.
                  </h2>
                  <p className="mt-3 text-[#6a594b]">
                    Tidak ada pembuatan akun baru di halaman ini.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                  <label className="block">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#6a594b]">
                      Username
                    </span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#251a12]/15 bg-white px-5 py-4 text-lg outline-none transition focus:border-[#2f7d6d] focus:ring-4 focus:ring-[#2f7d6d]/15"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="contoh: admin-bs"
                      autoComplete="username"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#6a594b]">
                      Password
                    </span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-[#251a12]/15 bg-white px-5 py-4 text-lg outline-none transition focus:border-[#2f7d6d] focus:ring-4 focus:ring-[#2f7d6d]/15"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan password"
                      type="password"
                      autoComplete="current-password"
                    />
                  </label>

                  <button className="w-full rounded-2xl bg-[#251a12] px-5 py-4 text-lg font-black text-[#fffaf0] transition hover:-translate-y-0.5 hover:bg-[#2f7d6d] focus:outline-none focus:ring-4 focus:ring-[#2f7d6d]/25">
                    Masuk ke Dashboard
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5efe3] px-4 py-6 text-[#251a12] sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] bg-[#243b35] text-[#fffaf0] shadow-2xl shadow-[#251a12]/15">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_380px] lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f4c86a]">
                BSC Cashflow
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-[-0.06em] sm:text-6xl">
                Dashboard kas BS
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/75">
                Kelola pemasukan dan pengeluaran, lalu lihat saldo akhir BS
                berubah otomatis setiap transaksi disimpan.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f4c86a]">
                Saldo BS
              </p>
              <p className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">
                {formatRupiah(balance)}
              </p>
              <p className="mt-3 text-sm text-white/65">Total kekayaan BS saat ini</p>
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-[2rem] border border-[#251a12]/10 bg-[#fffaf0] p-5 shadow-xl shadow-[#251a12]/10 sm:p-8">
            <div className="grid gap-3 rounded-3xl bg-[#efe4d0] p-2 sm:grid-cols-2">
              <button
                className={`rounded-2xl px-5 py-4 text-left font-black transition ${
                  activeMenu === "pemasukan"
                    ? "bg-[#2f7d6d] text-white shadow-lg shadow-[#2f7d6d]/25"
                    : "text-[#6a594b] hover:bg-white/70"
                }`}
                onClick={() => setActiveMenu("pemasukan")}
              >
                Pemasukan
              </button>
              <button
                className={`rounded-2xl px-5 py-4 text-left font-black transition ${
                  activeMenu === "pengeluaran"
                    ? "bg-[#9d3f2f] text-white shadow-lg shadow-[#9d3f2f]/20"
                    : "text-[#6a594b] hover:bg-white/70"
                }`}
                onClick={() => setActiveMenu("pengeluaran")}
              >
                Pengeluaran
              </button>
            </div>

            {activeMenu === "pemasukan" ? (
              <form className="mt-8 grid gap-5" onSubmit={saveIncome}>
                <FormTitle
                  eyebrow="Form Pemasukan"
                  title="Catat uang masuk BS"
                  description="Saldo akhir otomatis dihitung dari Saldo BS ditambah Harga total."
                />
                <TextInput
                  label="Nama menu"
                  value={income.namaMenu}
                  onChange={(value) => setIncome({ ...income, namaMenu: value })}
                  placeholder="Es kopi gula aren"
                />
                <TextInput
                  label="Kategori"
                  value={income.kategori}
                  onChange={(value) => setIncome({ ...income, kategori: value })}
                  placeholder="Minuman"
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput
                    label="Harga satuan"
                    value={income.hargaSatuan}
                    onChange={(value) => setIncome({ ...income, hargaSatuan: value })}
                    placeholder="12000"
                    inputMode="numeric"
                  />
                  <TextInput
                    label="Unit"
                    value={income.unit}
                    onChange={(value) => setIncome({ ...income, unit: value })}
                    placeholder="1 gelas, 1 porsi"
                  />
                </div>
                <TextInput
                  label="Harga total"
                  value={income.hargaTotal}
                  onChange={(value) => setIncome({ ...income, hargaTotal: value })}
                  placeholder="12000"
                  inputMode="numeric"
                />
                <ReadonlyMoney
                  label="Total saldo akhir BS-Cashflow"
                  value={incomeBalanceAfter}
                />
                <SubmitButton tone="income">Simpan Pemasukan</SubmitButton>
              </form>
            ) : (
              <form className="mt-8 grid gap-5" onSubmit={saveExpense}>
                <FormTitle
                  eyebrow="Form Pengeluaran"
                  title="Catat uang keluar BS"
                  description="Saldo akhir otomatis dihitung dari Saldo BS dikurangi Total harga."
                />
                <TextInput
                  label="Nama keterangan pengeluaran"
                  value={expense.keterangan}
                  onChange={(value) => setExpense({ ...expense, keterangan: value })}
                  placeholder="Belanja bahan baku"
                />
                <div className="grid gap-5 md:grid-cols-2">
                  <TextInput
                    label="Unit"
                    value={expense.unit}
                    onChange={(value) => setExpense({ ...expense, unit: value })}
                    placeholder="2 pack, 1 kardus"
                  />
                  <TextInput
                    label="Harga satuan"
                    value={expense.hargaSatuan}
                    onChange={(value) => setExpense({ ...expense, hargaSatuan: value })}
                    placeholder="50000"
                    inputMode="numeric"
                  />
                </div>
                <TextInput
                  label="Total harga"
                  value={expense.totalHarga}
                  onChange={(value) => setExpense({ ...expense, totalHarga: value })}
                  placeholder="100000"
                  inputMode="numeric"
                />
                <ReadonlyMoney label="Saldo akhir BS" value={expenseBalanceAfter} />
                <SubmitButton tone="expense">Simpan Pengeluaran</SubmitButton>
              </form>
            )}
          </section>

          <aside className="rounded-[2rem] border border-[#251a12]/10 bg-[#fffaf0] p-5 shadow-xl shadow-[#251a12]/10 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#2f7d6d]">
              Riwayat
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
              Transaksi terbaru
            </h2>
            <div className="mt-6 space-y-3">
              {transactions.length === 0 ? (
                <p className="rounded-3xl bg-[#efe4d0] p-5 text-[#6a594b]">
                  Belum ada transaksi. Simpan pemasukan atau pengeluaran pertama
                  untuk mulai membentuk saldo BS.
                </p>
              ) : (
                transactions.map((transaction) => (
                  <article
                    className="rounded-3xl border border-[#251a12]/10 bg-white p-5"
                    key={transaction.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black">{transaction.title}</p>
                        <p className="mt-1 text-sm capitalize text-[#6a594b]">
                          {transaction.type}
                        </p>
                      </div>
                      <p
                        className={`font-black ${
                          transaction.type === "pemasukan"
                            ? "text-[#2f7d6d]"
                            : "text-[#9d3f2f]"
                        }`}
                      >
                        {transaction.type === "pemasukan" ? "+" : "-"}
                        {formatRupiah(transaction.amount)}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-[#6a594b]">
                      Saldo akhir: {formatRupiah(transaction.balanceAfter)}
                    </p>
                  </article>
                ))
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function FormTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#2f7d6d]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-[#6a594b]">{description}</p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric";
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#6a594b]">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-[#251a12]/15 bg-white px-5 py-4 text-lg outline-none transition focus:border-[#2f7d6d] focus:ring-4 focus:ring-[#2f7d6d]/15"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
      />
    </label>
  );
}

function ReadonlyMoney({ label, value }: { label: string; value: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#6a594b]">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-[#251a12]/15 bg-[#efe4d0] px-5 py-4 text-lg font-black text-[#251a12] outline-none"
        value={formatRupiah(value)}
        readOnly
      />
    </label>
  );
}

function SubmitButton({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "income" | "expense";
}) {
  const className =
    tone === "income"
      ? "bg-[#2f7d6d] hover:bg-[#256357] focus:ring-[#2f7d6d]/25"
      : "bg-[#9d3f2f] hover:bg-[#7d3024] focus:ring-[#9d3f2f]/20";

  return (
    <button
      className={`rounded-2xl px-5 py-4 text-lg font-black text-white transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${className}`}
    >
      {children}
    </button>
  );
}
