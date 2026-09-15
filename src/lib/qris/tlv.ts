export interface TLVElement {
  tag: string;
  length: number;
  value: string;
}

/**
 * Parses a flat EMVCo TLV string into an ordered list of top-level elements.
 * Sub-tags inside merchant account info blocks (26-51) are kept opaque —
 * we never need to look inside them for a static->dynamic conversion.
 */
export function parseTLV(data: string): TLVElement[] {
  const elements: TLVElement[] = [];
  let pos = 0;

  while (pos < data.length) {
    const tag = data.substring(pos, pos + 2);
    const lengthStr = data.substring(pos + 2, pos + 4);
    const length = parseInt(lengthStr, 10);

    if (tag.length < 2 || Number.isNaN(length)) break;

    const value = data.substring(pos + 4, pos + 4 + length);
    elements.push({ tag, length, value });
    pos += 4 + length;
  }

  return elements;
}

export function serializeTLV(el: TLVElement): string {
  const length = el.value.length.toString().padStart(2, "0");
  return `${el.tag}${length}${el.value}`;
}

/** Rebuilds a full payload string from elements, sorted by ascending tag,
 * and appends a freshly computed CRC (tag 63) at the end. */
export function buildPayload(elements: TLVElement[], crcFn: (s: string) => string): string {
  const withoutCrc = elements.filter((el) => el.tag !== "63");
  const sorted = [...withoutCrc].sort((a, b) => parseInt(a.tag, 10) - parseInt(b.tag, 10));

  const body = sorted.map(serializeTLV).join("");
  const bodyWithCrcHeader = `${body}6304`;
  const crc = crcFn(bodyWithCrcHeader);

  return `${bodyWithCrcHeader}${crc}`;
}
