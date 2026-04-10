import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password tidak boleh kosong." },
        { status: 400 }
      );
    }

    const { data: karyawan, error } = await supabase
      .from("karyawan")
      .select("id, username, password, nama_lengkap, role")
      .eq("username", username)
      .single();

    if (error || !karyawan) {
      return NextResponse.json(
        { error: "Username tidak terdaftar." },
        { status: 401 }
      );
    }

    // Pengecekan bcrypt hash
    const isPasswordMatch = bcrypt.compareSync(password, karyawan.password);
    
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Sandi salah!" },
        { status: 401 }
      );
    }

    // Berhasil Login: kembalikan tanpa password
    return NextResponse.json(
      {
        user: {
          id: karyawan.id,
          username: karyawan.username,
          nama_lengkap: karyawan.nama_lengkap,
          role: karyawan.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}
