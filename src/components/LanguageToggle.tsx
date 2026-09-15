"use client";

import { Languages } from "lucide-react";
import type { Language } from "@/types/qris";

interface Props {
  language: Language;
  onChange: (lang: Language) => void;
}

export function LanguageToggle({ language, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(language === "en" ? "id" : "en")}
      className="flex items-center gap-1.5 rounded-full border border-ink-line bg-ink-soft px-3 py-2 text-xs font-semibold uppercase text-mist hover:text-white"
      aria-label="Toggle language"
    >
      <Languages size={14} />
      {language}
    </button>
  );
}
