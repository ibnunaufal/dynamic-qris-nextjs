/**
 * CRC-16/CCITT-FALSE — the checksum algorithm EMVCo QR payloads (and QRIS)
 * use for tag 63. Polynomial 0x1021, initial value 0xFFFF, no reflect, no xor-out.
 */
export function crc16ccitt(input: string): string {
  let crc = 0xffff;

  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}
