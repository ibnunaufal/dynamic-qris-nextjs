"use client";

import { useCallback, useEffect, useState } from "react";
import type { Language } from "@/types/qris";
import { detectDeviceLanguage, translate, type TranslationKey } from "@/lib/i18n";
import { getStoredLanguage, setStoredLanguage } from "@/lib/storage";

export function useLanguage() {
  const [language, setLanguageState] = useState<Language>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredLanguage();
    setLanguageState(stored ?? detectDeviceLanguage());
    setReady(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  }, []);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  return { language, setLanguage, t, ready };
}
