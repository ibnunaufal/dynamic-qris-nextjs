# QRIS Dinamis

Simpan QRIS statis kamu, lalu generate QRIS dinamis dengan nominal custom — semua tersimpan di device (localStorage), tanpa backend.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Deploy ke Vercel

1. Push folder ini ke sebuah GitHub repo.
2. Import repo tersebut di https://vercel.com/new — Vercel otomatis mendeteksi ini sebagai project Next.js, tidak perlu konfigurasi tambahan.
3. Deploy.

## Cara kerja konversi QRIS

Logika ada di `src/lib/qris/`:
- `tlv.ts` — parser & serializer TLV (Tag-Length-Value) ala EMVCo.
- `crc16.ts` — checksum CRC16-CCITT (False) yang dipakai QRIS di tag 63.
- `converter.ts` — mengubah tag `01` dari `11` (statis) ke `12` (dinamis), menyisipkan tag `54` (nominal), lalu menghitung ulang CRC.
- `validator.ts` — validasi struktur + CRC sebelum sebuah QRIS disimpan.

## Catatan PWA

- Manifest di-generate lewat `src/app/manifest.ts` (fitur native Next.js App Router).
- Service worker sederhana ada di `public/sw.js` (cache app shell untuk akses offline & supaya browser menganggap app ini installable).
- Ikon ada di `public/icons/` — hasil generate dari `scripts/gen_icons.py`, silakan diganti dengan brand asset sendiri kalau mau.

## Struktur data localStorage

```ts
// key: "savedQris"
[{ id: 1699999999999, name: "Warung Bu Sri", qris: "00020101021226..." }]

// key: "selectedQrisId" -> number
// key: "language" -> "en" | "id"
```
