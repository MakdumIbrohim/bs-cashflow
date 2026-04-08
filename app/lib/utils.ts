export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatDate = (value: string) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

export const formatMonth = (yearMonth: string) => {
  if (!yearMonth) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${yearMonth}-01`));
};

export const parseMoney = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;
export const parseQuantity = (value: string) => Number(value.replace(/[^0-9]/g, "")) || 0;
