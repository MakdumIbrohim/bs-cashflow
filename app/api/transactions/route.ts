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

function normalizeTransaction(item: unknown, fallbackIndex: number): Transaction | null {
  if (!item || typeof item !== "object") return null;

  const record = item as UnknownRecord;
  const amount = toNumber(
    record.amount ?? record.nominal ?? record.hargaTotal ?? record.totalHarga,
  );
  const balanceAfter = toNumber(
    record.balanceAfter ?? record.saldoAkhir ?? record.balance ?? record.saldo,
  );
  const date =
    typeof record.date === "string"
      ? record.date
      : typeof record.tanggal === "string"
        ? record.tanggal
        : "";
  const title =
    typeof record.title === "string"
      ? record.title
      : typeof record.namaMenu === "string"
        ? record.namaMenu
        : typeof record.keterangan === "string"
          ? record.keterangan
          : "";

  if (!date || !title) return null;

  return {
    id: toNumber(record.id) || Date.now() + fallbackIndex,
    type: toMenu(record.type ?? record.jenis),
    date,
    title,
    amount,
    balanceAfter,
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

  return rawList
    .map((item, index) => normalizeTransaction(item, index))
    .filter((item): item is Transaction => item !== null)
    .sort((a, b) => {
      if (a.date === b.date) {
        return b.id - a.id;
      }
      return b.date.localeCompare(a.date);
    });
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
