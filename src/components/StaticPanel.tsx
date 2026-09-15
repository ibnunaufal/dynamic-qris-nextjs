"use client";

import { QrCodeCard } from "@/components/QrCodeCard";
import type { SavedQris } from "@/types/qris";

interface Props {
  selected: SavedQris | null;
  hint: string;
  downloadLabel: string;
}

export function StaticPanel({ selected, hint, downloadLabel }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="max-w-[26ch] text-center text-sm text-mist">{hint}</p>
      <QrCodeCard value={selected?.qris ?? null} downloadLabel={downloadLabel} />
    </div>
  );
}
