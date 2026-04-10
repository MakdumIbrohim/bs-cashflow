import { createClient } from "@supabase/supabase-js";

// Tambahkan nilai string sementara ('https://placeholder.supabase.co') agar Vercel build 
// tidak crash jika variabel lingkungan (environment variables) belum terpasang saat proses build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  console.warn("Supabase URL or Anon/Publishable Key is missing in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
