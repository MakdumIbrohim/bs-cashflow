import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "BSC Cashflow",
  description: "Aplikasi pencatatan saldo BS untuk pemasukan dan pengeluaran.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className={`min-h-full ${plusJakartaSans.className} bg-slate-50 text-slate-900`}>{children}</body>
    </html>
  );
}
