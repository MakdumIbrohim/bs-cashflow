"use client";

import { FormEvent, useMemo, useState } from "react";

type Menu = "pemasukan" | "pengeluaran";
type SidebarView = "dashboard" | "riwayat";

type IncomeForm = {
  tanggal: string;
  namaMenu: string;
  kategori: string;
  hargaSatuan: string;
  unit: string;
  hargaTotal: string;
};

type ExpenseForm = {
  tanggal: string;
  keterangan: string;
  unit: string;
  hargaSatuan: string;
  totalHarga: string;
};

type Transaction = {
  id: number;
  type: Menu;
  date: string;
  title: string;
  amount: number;
  balanceAfter: number;
};

type ProductMenu = {
  name: string;
  category: "Minuman" | "Cemilan";
  price: number;
};

const emptyIncome: IncomeForm = {
  tanggal: new Date().toISOString().split("T")[0] ?? "",
  namaMenu: "",
  kategori: "",
  hargaSatuan: "",
  unit: "",
  hargaTotal: "",
};

const emptyExpense: ExpenseForm = {
  tanggal: new Date().toISOString().split("T")[0] ?? "",
  keterangan: "",
  unit: "",
  hargaSatuan: "",
  totalHarga: "",
};

const productMenus: ProductMenu[] = [
  { name: "Espresso", category: "Minuman", price: 10000 },
  { name: "Americano", category: "Minuman", price: 8000 },
  { name: "Cappucino", category: "Minuman", price: 10000 },
  { name: "Latte", category: "Minuman", price: 10000 },
  { name: "Coco Coffee", category: "Minuman", price: 10000 },
  { name: "Madura Coffe", category: "Minuman", price: 5000 },
  { name: "Madura Milk Coffe", category: "Minuman", price: 6000 },
  { name: "Air mineral", category: "Minuman", price: 3000 },
  { name: "Creamy Milk Tea", category: "Minuman", price: 7000 },
  { name: "Original Hot Tea", category: "Minuman", price: 5000 },
  { name: "Kentang Goreng", category: "Cemilan", price: 10000 },
  { name: "Soget (sosis nuget)", category: "Cemilan", price: 10000 },
  { name: "Mix Plate", category: "Cemilan", price: 10000 },
  { name: "Piscok", category: "Cemilan", price: 10000 },
  { name: "Es Teh", category: "Cemilan", price: 10000 },
];

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "pemasukan",
    date: "2026-04-08",
    title: "Espresso",
    amount: 20000,
    balanceAfter: 20000,
  },
  {
    id: 2,
    type: "pengeluaran",
    date: "2026-04-08",
    title: "Belanja gula aren",
    amount: 12000,
    balanceAfter: 8000,
  },
  {
    id: 3,
    type: "pemasukan",
    date: "2026-04-07",
    title: "Kentang Goreng",
    amount: 30000,
    balanceAfter: 42000,
  },
  {
    id: 4,
    type: "pengeluaran",
    date: "2026-04-07",
    title: "Beli cup minuman",
    amount: 10000,
    balanceAfter: 12000,
  },
  {
    id: 5,
    type: "pemasukan",
    date: "2026-04-06",
    title: "Creamy Milk Tea",
    amount: 21000,
    balanceAfter: 22000,
  },
];

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const formatMonth = (yearMonth: string) => {
  if (!yearMonth) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${yearMonth}-01`));
};

const parseMoney = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;
const parseQuantity = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeView, setActiveView] = useState<SidebarView>("dashboard");
  const [activeMenu, setActiveMenu] = useState<Menu>("pemasukan");
  const [balance, setBalance] = useState(
    initialTransactions[0]?.balanceAfter ?? 0,
  );
  const [income, setIncome] = useState<IncomeForm>(emptyIncome);
  const [expense, setExpense] = useState<ExpenseForm>(emptyExpense);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [historyYearFilter, setHistoryYearFilter] = useState("");
  const [historyMonthFilter, setHistoryMonthFilter] = useState("");
  const [historyDayFilter, setHistoryDayFilter] = useState("");

  const incomeUnit = parseQuantity(income.unit);
  const expenseUnit = parseQuantity(expense.unit);
  const incomePrice = parseMoney(income.hargaSatuan);
  const expensePrice = parseMoney(expense.hargaSatuan);
  const incomeTotal = incomeUnit * incomePrice;
  const expenseTotal = expenseUnit * expensePrice;

  const incomeBalanceAfter = useMemo(
    () => balance + incomeTotal,
    [balance, incomeTotal],
  );

  const expenseBalanceAfter = useMemo(
    () => balance - expenseTotal,
    [balance, expenseTotal],
  );
  const uniqueTransactionYears = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((transaction) => transaction.date.slice(0, 4))),
      ).sort((a, b) => Number(b) - Number(a)),
    [transactions],
  );
  const availableMonths = useMemo(() => {
    if (!historyYearFilter) {
      return [];
    }

    return Array.from(
      new Set(
        transactions
          .filter((transaction) => transaction.date.startsWith(historyYearFilter))
          .map((transaction) => transaction.date.slice(0, 7)),
      ),
    ).sort((a, b) => b.localeCompare(a));
  }, [historyYearFilter, transactions]);
  const availableDays = useMemo(() => {
    if (!historyMonthFilter) {
      return [];
    }

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
        transaction.date.startsWith(historyYearFilter),
      );
    }

    if (historyMonthFilter) {
      currentTransactions = currentTransactions.filter((transaction) =>
        transaction.date.startsWith(historyMonthFilter),
      );
    }

    if (historyDayFilter) {
      currentTransactions = currentTransactions.filter(
        (transaction) => transaction.date === historyDayFilter,
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
        date: income.tanggal,
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
        date: expense.tanggal,
        title: expense.keterangan,
        amount: expenseTotal,
        balanceAfter: nextBalance,
      },
      ...current,
    ]);
    setExpense(emptyExpense);
  }

  function selectProductMenu(menuName: string) {
    const selectedMenu = productMenus.find((menu) => menu.name === menuName);

    if (!selectedMenu) {
      setIncome(emptyIncome);
      return;
    }

    const price = String(selectedMenu.price);
    setIncome({
      ...income,
      namaMenu: selectedMenu.name,
      kategori: selectedMenu.category,
      hargaSatuan: price,
      unit: income.unit || "1",
      hargaTotal: String(selectedMenu.price * (parseQuantity(income.unit) || 1)),
    });
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <section className="relative grid min-h-screen place-items-center px-6 py-10">
          {/* Abstract background elements */}
          <div className="absolute -left-24 top-10 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -right-20 bottom-4 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
          
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex min-h-[520px] flex-col justify-between bg-emerald-950 p-8 text-white sm:p-12">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                    BSC Cashflow
                  </p>
                  <h1 className="mt-10 max-w-xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">
                    Pantau uang BS tanpa ribet.
                  </h1>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                  <p className="text-sm uppercase tracking-[0.25em] text-emerald-400">
                    Akses internal
                  </p>
                  <p className="mt-3 text-lg leading-relaxed text-emerald-50/80">
                    Masuk dengan username dan password untuk langsung menuju halaman utama pengelolaan saldo.
                  </p>
                </div>
              </div>

              <div className="p-8 sm:p-12">
                <div className="mb-10">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
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
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="contoh: admin-bs"
                      autoComplete="username"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                      Password
                    </span>
                    <input
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan password"
                      type="password"
                      autoComplete="current-password"
                    />
                  </label>

                  <button className="mt-2 w-full rounded-2xl bg-slate-900 px-5 py-4 text-lg font-black text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1 hover:bg-emerald-600 hover:shadow-emerald-600/30 focus:outline-none focus:ring-4 focus:ring-emerald-600/25">
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
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-[2rem] bg-emerald-950 text-white shadow-2xl shadow-emerald-900/10">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_380px] lg:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                BSC Cashflow
              </p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                Dashboard kas BS
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-emerald-50/80">
                Kelola pemasukan dan pengeluaran, lalu lihat saldo akhir BS
                berubah otomatis setiap transaksi disimpan.
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
              Sidebar
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Navigasi
            </h2>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                className={`rounded-3xl px-5 py-4 text-left transition-all ${
                  activeView === "dashboard"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setActiveView("dashboard")}
              >
                <p className="font-black">Dashboard</p>
                <p
                  className={`mt-1 text-sm ${
                    activeView === "dashboard" ? "text-emerald-50" : "text-slate-500"
                  }`}
                >
                  Saldo BS, pemasukan, dan pengeluaran.
                </p>
              </button>
              <button
                type="button"
                className={`rounded-3xl px-5 py-4 text-left transition-all ${
                  activeView === "riwayat"
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                onClick={() => setActiveView("riwayat")}
              >
                <p className="font-black">Riwayat Transaksi</p>
                <p
                  className={`mt-1 text-sm ${
                    activeView === "riwayat" ? "text-emerald-50" : "text-slate-500"
                  }`}
                >
                  Semua riwayat dan filter per tanggal.
                </p>
              </button>
            </div>
          </aside>

          {activeView === "dashboard" ? (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
              <div className="grid gap-3 rounded-3xl bg-slate-100 p-2 sm:grid-cols-2">
                <button
                  type="button"
                  className={`rounded-2xl px-5 py-4 text-left font-black transition-all ${
                    activeMenu === "pemasukan"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "text-slate-600 hover:bg-white"
                  }`}
                  onClick={() => setActiveMenu("pemasukan")}
                >
                  Pemasukan
                </button>
                <button
                  type="button"
                  className={`rounded-2xl px-5 py-4 text-left font-black transition-all ${
                    activeMenu === "pengeluaran"
                      ? "bg-rose-600 text-white shadow-md shadow-rose-600/25"
                      : "text-slate-600 hover:bg-white"
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
                  <DateInput
                    label="Tanggal"
                    value={income.tanggal}
                    onChange={(value) => setIncome({ ...income, tanggal: value })}
                  />
                  <SelectInput
                    label="Nama menu"
                    value={income.namaMenu}
                    onChange={selectProductMenu}
                    placeholder="Pilih menu"
                    options={productMenus.map((menu) => ({
                      label: menu.name,
                      value: menu.name,
                    }))}
                  />
                  <TextInput
                    label="Kategori"
                    value={income.kategori}
                    onChange={(value) => setIncome({ ...income, kategori: value })}
                    placeholder="Terisi otomatis setelah pilih nama menu"
                    readOnly
                    disabled
                  />
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextInput
                      label="Harga satuan"
                      value={
                        income.hargaSatuan
                          ? formatRupiah(parseMoney(income.hargaSatuan))
                          : ""
                      }
                      onChange={() => undefined}
                      placeholder="Terisi otomatis setelah pilih nama menu"
                      readOnly
                      disabled
                    />
                    <TextInput
                      label="Unit"
                      value={income.unit}
                      onChange={(value) => setIncome({ ...income, unit: value })}
                      placeholder="Masukkan jumlah unit"
                      inputMode="numeric"
                    />
                  </div>
                  <ReadonlyMoney label="Harga total" value={incomeTotal} />
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
                  <DateInput
                    label="Tanggal"
                    value={expense.tanggal}
                    onChange={(value) => setExpense({ ...expense, tanggal: value })}
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
                      placeholder="Masukkan jumlah unit"
                      inputMode="numeric"
                    />
                    <TextInput
                      label="Harga satuan"
                      value={expense.hargaSatuan}
                      onChange={(value) => setExpense({ ...expense, hargaSatuan: value })}
                      placeholder="50000"
                      inputMode="numeric"
                    />
                  </div>
                  <ReadonlyMoney label="Total harga" value={expenseTotal} />
                  <ReadonlyMoney label="Saldo akhir BS" value={expenseBalanceAfter} />
                  <SubmitButton tone="expense">Simpan Pengeluaran</SubmitButton>
                </form>
              )}
            </section>
          ) : (
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
                {transactions.length === 0 ? (
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
          )}
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
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-emerald-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-slate-500">{description}</p>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  readOnly = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "numeric";
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        readOnly={readOnly}
        disabled={disabled}
      />
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <select
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-lg outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ReadonlyMoney({ label, value }: { label: string; value: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-5 py-4 text-lg font-black text-slate-900 outline-none"
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
      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/25 shadow-lg shadow-emerald-600/20"
      : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/25 shadow-lg shadow-rose-600/20";

  return (
    <button
      className={`rounded-2xl px-5 py-4 text-lg font-black text-white transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-4 ${className}`}
    >
      {children}
    </button>
  );
}
