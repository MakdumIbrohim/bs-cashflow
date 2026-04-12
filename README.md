# BS Cashflow

BS Cashflow adalah aplikasi pencatatan kas untuk mencatat pemasukan dan pengeluaran harian BS cafe. Aplikasi ini dipakai untuk:

- login pengguna internal
- mencatat transaksi pemasukan
- mencatat transaksi pengeluaran
- menghitung saldo akhir otomatis
- melihat riwayat transaksi
- mengekspor riwayat transaksi ke PDF

## Data Disimpan Di Mana

Project ini memakai beberapa tempat penyimpanan data:

- `Supabase`
  Dipakai untuk data login pengguna pada tabel `karyawan`. Endpoint login ada di `app/api/auth/login/route.ts`.

- `Google Apps Script`
  Dipakai untuk membaca dan menyimpan data transaksi kas. Endpoint transaksi ada di `app/api/transactions/route.ts`.

- `localStorage` browser
  Dipakai untuk menyimpan status login sementara di sisi client, yaitu:
  `bs_isLoggedIn` dan `bs_user`.

Jadi singkatnya:

- data akun user: `Supabase`
- data transaksi kas: `Google Apps Script`
- sesi login di browser: `localStorage`

## Fitur Utama

- Login user internal
- Form pemasukan
- Form pengeluaran
- Perhitungan saldo otomatis
- Riwayat transaksi dengan filter tanggal
- Ekspor transaksi ke PDF

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase
- Google Apps Script

## Struktur Singkat

- `app/login/page.tsx`
  Halaman login.

- `app/dashboard/page.tsx`
  Halaman input pemasukan dan pengeluaran.

- `app/history/page.tsx`
  Halaman riwayat transaksi dan ekspor PDF.

- `app/api/auth/login/route.ts`
  API login yang memeriksa user ke Supabase.

- `app/api/transactions/route.ts`
  API untuk mengambil dan menyimpan transaksi melalui Google Apps Script.

- `app/context/AppContext.tsx`
  Menyimpan state global aplikasi seperti user login, transaksi, saldo, dan toast.

## Environment Variables

Buat file `.env.local` lalu isi minimal seperti ini:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GOOGLE_APPS_SCRIPT_URL=your_google_apps_script_url
```

Keterangan:

- `NEXT_PUBLIC_SUPABASE_URL`
  URL project Supabase.

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  key publishable/anon Supabase untuk akses client.

- `GOOGLE_APPS_SCRIPT_URL`
  URL web app Google Apps Script untuk transaksi. Wajib diisi karena aplikasi membaca dan menyimpan transaksi melalui endpoint ini.

## Menjalankan Project

Install dependency:

```bash
pnpm install
```

Jalankan mode development:

```bash
pnpm dev
```

Buka:

```text
http://localhost:3000
```

## Alur Data

1. User login dari halaman login.
2. API login memeriksa `username` dan `password` ke tabel `karyawan` di Supabase.
3. Jika berhasil, data user disimpan ke `localStorage`.
4. Saat aplikasi dibuka, transaksi diambil dari Google Apps Script.
5. Saat user menambah pemasukan atau pengeluaran, data dikirim ke Google Apps Script.
6. Saldo dihitung ulang berdasarkan urutan transaksi.

## Catatan

- Password login dicek menggunakan `bcrypt`.
- Saldo aplikasi dihitung dari data transaksi, bukan dari field saldo terpisah yang disimpan manual.
- Riwayat transaksi ditampilkan dari data terbaru ke data terlama.
