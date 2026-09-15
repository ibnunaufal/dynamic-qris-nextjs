import { parseTLV, buildPayload, type TLVElement } from "./tlv";
import { crc16ccitt } from "./crc16";

const TAG_POINT_OF_INITIATION = "01";
const TAG_AMOUNT = "54";
const TAG_TIP_INDICATOR = "55";
const TAG_TIP_FIXED = "56";
const TAG_TIP_PERCENT = "57";
const DYNAMIC_VALUE = "12";

export interface ConvertOptions {
  amount: number;
}

export interface ConvertResult {
  payload: string;
  amount: number;
}

/**
 * Converts a static QRIS payload into a dynamic one carrying a fixed
 * transaction amount: flips tag 01 to "12", (re)injects tag 54 with the
 * amount, strips any pre-existing tip/fee tags, and recalculates the CRC.
 */
export function convertQRIStoDynamic(staticPayload: string, options: ConvertOptions): ConvertResult {
  const { amount } = options;

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const elements = parseTLV(staticPayload);

  if (elements.length === 0) {
    throw new Error("INVALID_PAYLOAD");
  }

  const filtered = elements.filter(
    (el) => ![TAG_AMOUNT, TAG_TIP_INDICATOR, TAG_TIP_FIXED, TAG_TIP_PERCENT].includes(el.tag)
  );

  const withDynamicFlag: TLVElement[] = filtered.map((el) =>
    el.tag === TAG_POINT_OF_INITIATION ? { ...el, value: DYNAMIC_VALUE } : el
  );

  const amountValue = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);

  withDynamicFlag.push({
    tag: TAG_AMOUNT,
    length: amountValue.length,
    value: amountValue,
  });

  const payload = buildPayload(withDynamicFlag, crc16ccitt);

  return { payload, amount };
}
