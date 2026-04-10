export type Menu = "pemasukan" | "pengeluaran";
export type SidebarView = "dashboard" | "riwayat";

export type IncomeForm = {
  tanggal: string;
  namaMenu: string;
  kategori: string;
  hargaSatuan: string;
  unit: string;
  hargaTotal: string;
};

export type ExpenseForm = {
  tanggal: string;
  keterangan: string;
  unit: string;
  hargaSatuan: string;
  totalHarga: string;
};

export type Transaction = {
  id: number;
  type: Menu;
  date: string;
  title: string;
  amount: number;
  balanceAfter: number;
};

export type CreateTransactionInput = {
  type: Menu;
  date: string;
  title: string;
  amount: number;
  kategori?: string;
  unit?: string | number;
  harga_satuan?: string | number;
};

export type ProductMenu = {
  name: string;
  category: "Minuman" | "Cemilan";
  price: number;
};

export const emptyIncome: IncomeForm = {
  tanggal: new Date().toISOString().split("T")[0] ?? "",
  namaMenu: "",
  kategori: "",
  hargaSatuan: "",
  unit: "",
  hargaTotal: "",
};

export const emptyExpense: ExpenseForm = {
  tanggal: new Date().toISOString().split("T")[0] ?? "",
  keterangan: "",
  unit: "",
  hargaSatuan: "",
  totalHarga: "",
};

export const productMenus: ProductMenu[] = [
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
  { name: "Es Teh", category: "Minuman", price: 10000 },
];

export const initialTransactions: Transaction[] = [
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
