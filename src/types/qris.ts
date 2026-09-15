import type { TLVElement } from "@/lib/qris/tlv";

export interface SavedQris {
  id: number;
  name: string;
  qris: string;
}

export interface QRISData {
  method: "static" | "dynamic";
  merchantName?: string;
  merchantCity?: string;
  countryCode?: string;
  currency?: string;
  amount?: string;
  raw: TLVElement[];
}

export type Tab = "static" | "dynamic";

export type Language = "en" | "id";
