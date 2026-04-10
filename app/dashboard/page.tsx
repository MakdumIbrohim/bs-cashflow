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
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "income" | "expense" | null;
  }>({ isOpen: false, type: null });

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

  function requestSaveIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!income.namaMenu.trim() || incomeTotal <= 0) return;
    setConfirmModal({ isOpen: true, type: "income" });
  }

  function requestSaveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!expense.keterangan.trim() || expenseTotal <= 0) return;
    setConfirmModal({ isOpen: true, type: "expense" });
  }

  async function confirmSave() {
    setIsSubmitting(true);
    setSubmitError("");
    
    if (confirmModal.type === "income") {
      try {
        await addIncome(income, incomeTotal);
        setIncome(emptyIncome);
        showToast(`Pemasukan ${income.namaMenu} berhasil dicatat!`, "success");
        setConfirmModal({ isOpen: false, type: null });
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Gagal menyimpan pemasukan.");
        setConfirmModal({ isOpen: false, type: null });
      } finally {
        setIsSubmitting(false);
      }
    } else if (confirmModal.type === "expense") {
      try {
        await addExpense(expense, expenseTotal);
        setExpense(emptyExpense);
        showToast(`Pengeluaran ${expense.keterangan} berhasil dicatat!`, "success");
        setConfirmModal({ isOpen: false, type: null });
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Gagal menyimpan pengeluaran.");
        setConfirmModal({ isOpen: false, type: null });
      } finally {
        setIsSubmitting(false);
      }
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
              <form className="mt-8 grid gap-5" onSubmit={requestSaveIncome}>
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
              <form className="mt-8 grid gap-5" onSubmit={requestSaveExpense}>
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

      {/* Modal Konfirmasi */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setConfirmModal({ isOpen: false, type: null })}></div>
          <div className="relative w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-black text-slate-900">
              Konfirmasi {confirmModal.type === "income" ? "Pemasukan" : "Pengeluaran"}
            </h2>
            <p className="mt-2 text-slate-500 text-sm">Harap periksa kembali detail transaksi di bawah ini sebelum menyimpan.</p>
            
            <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4 text-sm sm:text-base">
              {confirmModal.type === "income" ? (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Kategori</span><span className="font-bold text-emerald-600">Pemasukan</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Tanggal</span><span className="font-bold text-slate-900">{income.tanggal}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Nama Menu</span><span className="font-bold text-slate-900">{income.namaMenu}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Volume</span><span className="font-bold text-slate-900">{income.unit} Pcs @ {formatRupiah(incomePrice)}</span></div>
                  <div className="flex justify-between pt-1"><span className="text-slate-500 font-bold">Total Pemasukan</span><span className="font-black text-emerald-600 text-lg">+{formatRupiah(incomeTotal)}</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Kategori</span><span className="font-bold text-rose-600">Pengeluaran</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Tanggal</span><span className="font-bold text-slate-900">{expense.tanggal}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Keterangan</span><span className="font-bold text-slate-900">{expense.keterangan}</span></div>
                  <div className="flex justify-between border-b border-slate-200 pb-3"><span className="text-slate-500">Volume</span><span className="font-bold text-slate-900">{expense.unit} Pcs @ {formatRupiah(expensePrice)}</span></div>
                  <div className="flex justify-between pt-1"><span className="text-slate-500 font-bold">Total Pengeluaran</span><span className="font-black text-rose-600 text-lg">-{formatRupiah(expenseTotal)}</span></div>
                </>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => setConfirmModal({ isOpen: false, type: null })} 
                className="w-full rounded-2xl bg-slate-100 py-3.5 font-bold text-slate-700 hover:bg-slate-200 disabled:opacity-50"
              >
                Batal Edit
              </button>
              <button 
                type="button"
                disabled={isSubmitting}
                onClick={confirmSave} 
                className="w-full flex justify-center items-center gap-2 rounded-2xl bg-slate-900 py-3.5 font-bold text-white hover:bg-black transition disabled:opacity-50"
              >
                {isSubmitting && (
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                )}
                {isSubmitting ? "Menyimpan..." : `Ya, Data Benar`}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
