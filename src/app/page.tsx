"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useSavedQris } from "@/hooks/useSavedQris";
import { LandingEmptyState } from "@/components/LandingEmptyState";
import { QrisDropdown } from "@/components/QrisDropdown";
import { LanguageToggle } from "@/components/LanguageToggle";
import { TabsSwitch } from "@/components/TabsSwitch";
import { StaticPanel } from "@/components/StaticPanel";
import { DynamicPanel } from "@/components/DynamicPanel";
import { AddQrisSheet } from "@/components/AddQrisSheet";
import type { Tab } from "@/types/qris";

export default function Home() {
  const { language, setLanguage, t, ready: langReady } = useLanguage();
  const { list, selected, selectedId, selectQris, addQris, ready: qrisReady } = useSavedQris();
  const [tab, setTab] = useState<Tab>("static");
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!langReady || !qrisReady) {
    return <div className="min-h-[100dvh] bg-ink" />;
  }

  const hasQris = list.length > 0;

  return (
    <main className="mx-auto min-h-[100dvh] max-w-md">
      {!hasQris ? (
        <LandingEmptyState t={t} onAdd={() => setSheetOpen(true)} />
      ) : (
        <div className="flex flex-col gap-6 px-5 pb-10 pt-8">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-white">{t("appName")}</p>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onChange={setLanguage} />
              <QrisDropdown
                list={list}
                selectedId={selectedId}
                onSelect={selectQris}
                onAddNew={() => setSheetOpen(true)}
                addNewLabel={t("addNewQris")}
              />
            </div>
          </header>

          <TabsSwitch value={tab} onChange={setTab} staticLabel={t("tabStatic")} dynamicLabel={t("tabDynamic")} />

          <section className="receipt-edge rounded-card border border-ink-line bg-ink-soft px-5 pb-2 pt-3 shadow-xl shadow-black/20">
            {tab === "static" ? (
              <StaticPanel selected={selected} hint={t("staticHint")} downloadLabel={t("downloadQr")} />
            ) : (
              <DynamicPanel selected={selected} t={t} />
            )}
          </section>
        </div>
      )}

      {sheetOpen && (
        <AddQrisSheet
          t={t}
          onClose={() => setSheetOpen(false)}
          onSave={(entry) => {
            addQris(entry);
            setSheetOpen(false);
          }}
        />
      )}
    </main>
  );
}
