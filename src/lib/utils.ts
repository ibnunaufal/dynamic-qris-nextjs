export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function digitsOnly(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export function truncateMiddle(value: string, visible = 10): string {
  if (value.length <= visible * 2 + 3) return value;
  return `${value.slice(0, visible)}…${value.slice(-visible)}`;
}
