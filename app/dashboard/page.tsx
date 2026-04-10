"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/AppContext";
import { Menu, IncomeForm, ExpenseForm, productMenus, emptyIncome, emptyExpense } from "../lib/types";
import { formatRupiah, parseMoney, parseQuantity } from "../lib/utils";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { 
  FormTitle, 
  DateInput, 
  SelectInput, 
  TextInput, 
  ReadonlyMoney, 
  SubmitButton 
} from "../components/FormComponents";

export default function DashboardPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    balance,
    addIncome,
    addExpense,
    isTransactionsLoading,
    transactionError,
    showToast,
  } = useAppContext();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const [activeMenu, setActiveMenu] = useState<Menu>("pemasukan");
  const [income, setIncome] = useState<IncomeForm>(emptyIncome);
  const [expense, setExpense] = useState<ExpenseForm>(emptyExpense);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const incomeUnit = parseQuantity(income.unit);
  const expenseUnit = parseQuantity(expense.unit);
  const incomePrice = parseMoney(income.hargaSatuan);
  const expensePrice = parseMoney(expense.hargaSatuan);
  const incomeTotal = incomeUnit * incomePrice;
  const expenseTotal = expenseUnit * expensePrice;

  const incomeBalanceAfter = balance + incomeTotal;
  const expenseBalanceAfter = balance - expenseTotal;

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

  async function saveIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!income.namaMenu.trim() || incomeTotal <= 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await addIncome(income, incomeTotal);
      setIncome(emptyIncome);
      showToast(`Pemasukan ${income.namaMenu} berhasil dicatat!`, "success");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal menyimpan pemasukan.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expense.keterangan.trim() || expenseTotal <= 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");
      await addExpense(expense, expenseTotal);
      setExpense(emptyExpense);
      showToast(`Pengeluaran ${expense.keterangan} berhasil dicatat!`, "success");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Gagal menyimpan pengeluaran.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoggedIn) return null; // Or loading spinner

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <Header />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
            {transactionError ? (
              <p className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {transactionError}
              </p>
            ) : null}

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
                {submitError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </p>
                ) : null}
                <SubmitButton tone="income" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Pemasukan"}
                </SubmitButton>
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
                {submitError ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </p>
                ) : null}
                <SubmitButton tone="expense" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Pengeluaran"}
                </SubmitButton>
              </form>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
