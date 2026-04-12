import { getGoogleAppsScriptUrl } from "../../lib/google-apps-script";
import type { CreateTransactionInput, Menu, Transaction } from "../../lib/types";

type UnknownRecord = Record<string, unknown>;

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    return Number(cleaned) || 0;
  }
  return 0;
}

function toMenu(value: unknown): Menu {
  return value === "pengeluaran" ? "pengeluaran" : "pemasukan";
}

function toStringValue(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeTransaction(item: unknown, fallbackIndex: number): Transaction | null {
  if (!item || typeof item !== "object") return null;

  const record = item as UnknownRecord;
  const amount = toNumber(
    record.amount ??
      record.nominal ??
      record.hargaTotal ??
      record.totalHarga ??
      record.harga_total ??
      record["Harga Total"],
  );
  const balanceAfter = toNumber(
    record.balanceAfter ?? record.saldoAkhir ?? record.balance ?? record.saldo,
  );
  const date =
    typeof record.date === "string"
      ? record.date
      : typeof record.tanggal === "string"
        ? record.tanggal
        : typeof record.Tanggal === "string"
          ? record.Tanggal
          : "";
  const title =
    typeof record.title === "string"
      ? record.title
      : typeof record.namaMenu === "string"
        ? record.namaMenu
        : typeof record.keterangan === "string"
          ? record.keterangan
          : typeof record.Keterangan === "string"
            ? record.Keterangan
            : typeof record["nama_menu / keterangan"] === "string"
              ? record["nama_menu / keterangan"]
              : "";
  const category = toStringValue(
    record.category ?? record.kategori ?? record.Kategori,
  );
  const unit = toStringValue(record.unit ?? record.Unit ?? record.qty ?? record.Qty);
  const unitPrice = toNumber(
    record.unitPrice ??
      record.hargaSatuan ??
      record.harga_satuan ??
      record["Harga Satuan"],
  );

  if (!date || !title) return null;

  return {
    id: toNumber(record.id ?? record.ID) || Date.now() + fallbackIndex,
    type: toMenu(record.type ?? record.jenis ?? record.tipe ?? record.Tipe),
    date,
    title,
    amount,
    balanceAfter,
    category,
    unit,
    unitPrice,
  };
}

function normalizeTransactions(payload: unknown): Transaction[] {
  const rawList = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? ((payload as UnknownRecord).data ??
          (payload as UnknownRecord).transactions ??
          (payload as UnknownRecord).riwayat)
      : null;

  if (!Array.isArray(rawList)) return [];

  const validTransactions = rawList
    .map((item, index) => normalizeTransaction(item, index))
    .filter((item): item is Transaction => item !== null);

  // 1. Urutkan dari yang paling lama ke yang terbaru (Kronologis)
  validTransactions.sort((a, b) => {
    if (a.date === b.date) {
      return a.id - b.id; // Asumsi ID lebih kecil = lebih lama dibuat
    }
    return a.date.localeCompare(b.date);
  });

  // 2. Hitung saldo berjalan (Running Balance)
  let currentBalance = 0;
  for (const t of validTransactions) {
    if (t.type === "pemasukan") {
      currentBalance += t.amount;
    } else {
      currentBalance -= t.amount;
    }
    t.balanceAfter = currentBalance;
  }

  // 3. Kembalikan ke urutan terbaru di atas (Reverse Chronological)
  validTransactions.sort((a, b) => {
    if (a.date === b.date) {
      return b.id - a.id;
    }
    return b.date.localeCompare(a.date);
  });

  return validTransactions;
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

export async function GET() {
  const response = await fetch(getGoogleAppsScriptUrl(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json(
      { message: "Gagal mengambil data dari Google Apps Script." },
      { status: response.status },
    );
  }

  const payload = await parseJsonResponse(response);
  const transactions = normalizeTransactions(payload);

  return Response.json({ transactions, source: payload });
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateTransactionInput;

  const upstreamBody = {
    tanggal: body.date,
    keterangan: body.title,
    tipe: body.type,
    kategori: body.kategori || "",
    unit: body.unit || "",
    harga_satuan: body.harga_satuan || "",
    harga_total: body.amount,
  };

  const response = await fetch(getGoogleAppsScriptUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(upstreamBody),
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json(
      { message: "Gagal menyimpan data ke Google Apps Script." },
      { status: response.status },
    );
  }

  const payload = await parseJsonResponse(response);
  const normalized = normalizeTransaction(payload, 0);

  return Response.json({
    transaction: normalized,
    source: payload,
  });
}
