import { parseTLV } from "./tlv";
import type { QRISData } from "@/types/qris";

const TAG_POINT_OF_INITIATION = "01";
const TAG_CURRENCY = "53";
const TAG_AMOUNT = "54";
const TAG_COUNTRY = "58";
const TAG_MERCHANT_NAME = "59";
const TAG_MERCHANT_CITY = "60";

export function parseQRIS(payload: string): QRISData {
  const raw = parseTLV(payload);
  const get = (tag: string) => raw.find((el) => el.tag === tag)?.value;

  const poi = get(TAG_POINT_OF_INITIATION);

  return {
    method: poi === "12" ? "dynamic" : "static",
    merchantName: get(TAG_MERCHANT_NAME),
    merchantCity: get(TAG_MERCHANT_CITY),
    countryCode: get(TAG_COUNTRY),
    currency: get(TAG_CURRENCY),
    amount: get(TAG_AMOUNT),
    raw,
  };
}
