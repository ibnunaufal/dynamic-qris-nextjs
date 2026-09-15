"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { QrCodeCard } from "@/components/QrCodeCard";
import { convertQRIStoDynamic } from "@/lib/qris/converter";
import { digitsOnly, formatRupiah } from "@/lib/utils";
import type { SavedQris } from "@/types/qris";
import type { TranslationKey } from "@/lib/i18n";

interface Props {
  selected: SavedQris | null;
  t: (key: TranslationKey) => string;
}

export function DynamicPanel({ selected, t }: Props) {
  const [rawAmount, setRawAmount] = useState("");
  const [result, setResult] = useState<{ payload: string; amount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const amountNumber = Number(rawAmount || 0);

  function handleGenerate() {
    setError(null);
    if (!selected) return;

    if (!amountNumber || amountNumber <= 0) {
      setError(t("invalidAmount"));
      setResult(null);
      return;
    }

    try {
      const converted = convertQRIStoDynamic(selected.qris, { amount: amountNumber });
      setResult(converted);
    } catch {
      setError(t("invalidQris"));
      setResult(null);
    }
  }

  return (
    <div className="flex flex-col gap-5 py-6">
      <p className="text-center text-sm text-mist">{t("dynamicHint")}</p>

      <div className="flex items-center gap-2 rounded-2xl border border-ink-line bg-ink-softer px-4 py-3 focus-within:border-signal">
        <span className="font-display text-lg font-medium text-mist">Rp</span>
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          value={rawAmount ? Number(rawAmount).toLocaleString("id-ID") : ""}
          onChange={(e) => {
            setRawAmount(digitsOnly(e.target.value));
            setResult(null);
          }}
          placeholder={t("nominalPlaceholder")}
          aria-label={t("nominalLabel")}
          className="tabular-nums flex-1 bg-transparent font-display text-lg font-semibold text-white outline-none placeholder:text-mist/50"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!selected}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-signal px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
        >
          {t("generate")}
          <ArrowRight size={15} />
        </button>
      </div>

      {error && <p className="text-center text-sm text-signal">{error}</p>}

      <div className="flex flex-col items-center gap-4 pt-2">
        {result && (
          <p className="tabular-nums font-display text-3xl font-semibold text-white animate-fade-in">
            {formatRupiah(result.amount)}
          </p>
        )}
        <QrCodeCard value={result?.payload ?? null} downloadLabel={t("downloadQr")} emptyHint={t("nominalLabel")} />
      </div>
    </div>
  );
}
