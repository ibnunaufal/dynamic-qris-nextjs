"use client";

import { ScanLine, Plus } from "lucide-react";
import type { TranslationKey } from "@/lib/i18n";

interface Props {
  t: (key: TranslationKey) => string;
  onAdd: () => void;
}

export function LandingEmptyState({ t, onAdd }: Props) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-ink-soft ring-1 ring-ink-line">
        <ScanLine size={34} className="text-signal" />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="font-display text-2xl font-semibold text-white">{t("emptyTitle")}</h1>
        <p className="max-w-[32ch] text-sm leading-relaxed text-mist">{t("emptyBody")}</p>
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-semibold text-white active:scale-[0.98]"
      >
        <Plus size={17} />
        {t("addQris")}
      </button>
    </div>
  );
}
