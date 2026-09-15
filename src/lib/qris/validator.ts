import { parseTLV } from "./tlv";
import { crc16ccitt } from "./crc16";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Validates a QRIS payload's TLV structure and CRC16 checksum. */
export function validateQRIS(payload: string): ValidationResult {
  const errors: string[] = [];
  const trimmed = payload.trim();

  if (trimmed.length < 20) {
    return { valid: false, errors: ["TOO_SHORT"] };
  }

  const crcTagIndex = trimmed.lastIndexOf("6304");
  if (crcTagIndex === -1 || crcTagIndex !== trimmed.length - 8) {
    errors.push("MISSING_CRC");
  } else {
    const expected = trimmed.slice(-4).toUpperCase();
    const bodyWithHeader = trimmed.slice(0, crcTagIndex + 4);
    const actual = crc16ccitt(bodyWithHeader);
    if (expected !== actual) {
      errors.push("CRC_MISMATCH");
    }
  }

  const elements = parseTLV(trimmed);
  if (elements.length === 0 || elements[0].tag !== "00") {
    errors.push("INVALID_STRUCTURE");
  }

  return { valid: errors.length === 0, errors };
}
