"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "./context/AppContext";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAppContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-slate-500">Memuat BSC Cashflow...</p>
    </div>
  );
}
