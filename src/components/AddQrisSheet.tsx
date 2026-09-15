"use client";

import { useRef, useState } from "react";
import { X, Camera, ImageUp } from "lucide-react";
import clsx from "clsx";
import { QrScanner } from "@/components/QrScanner";
import { decodeImageQr } from "@/lib/decodeImageQr";
import { validateQRIS } from "@/lib/qris/validator";
import type { TranslationKey } from "@/lib/i18n";
import { parseQRIS } from "@/lib/qris/parser";


interface Props {
  t: (key: TranslationKey) => string;
  onClose: () => void;
  onSave: (entry: { name: string; qris: string }) => void;
}

type Mode = "idle" | "camera";

export function AddQrisSheet({ t, onClose, onSave }: Props) {
  const [mode, setMode] = useState<Mode>("idle");
  const [qris, setQris] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);

  function handleDetected(value: string) {
    setQris(value);
    setMode("idle");
    setError(null);
    setShowInput(true);

     const info = parseQRIS(value);
     if (info.merchantName) setName(info.merchantName);
  }

  function handleCameraError() {
    setMode("idle");
    setError(t("cameraError"));
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const value = await decodeImageQr(file);
      if (!value) {
        setError(t("noQrFound"));
        return;
      }
      setQris(value);
      setError(null);

      const info = parseQRIS(value);
      if (info.merchantName) setName(info.merchantName);
    } catch {
      setError(t("noQrFound"));
    }
  }

  function handleSave() {
    const trimmedName = name.trim();
    const trimmedQris = qris.trim();

    if (!trimmedName || !trimmedQris) {
      setError(t("saveError"));
      return;
    }

    const validation = validateQRIS(trimmedQris);
    if (!validation.valid) {
      setError(t("invalidQris"));
      return;
    }

    onSave({ name: trimmedName, qris: trimmedQris });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 animate-fade-in" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-slide-up rounded-t-sheet border-t border-ink-line bg-ink-soft px-5 pb-8 pt-5 sm:mb-6 sm:rounded-sheet sm:border"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink-line sm:hidden" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-white">{t("addNewQris")}</h2>
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-mist hover:text-white" aria-label={t("close")}>
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode(mode === "camera" ? "idle" : "camera")}
            className={clsx(
              "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
              mode === "camera" ? "border-signal bg-signal/10 text-signal" : "border-ink-line text-mist hover:text-white"
            )}
          >
            <Camera size={16} />
            {t("scan")}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-ink-line px-4 py-2.5 text-sm font-semibold text-mist hover:text-white"
          >
            <ImageUp size={16} />
            {t("selectImage")}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {mode === "camera" && (
          <div className="mb-4">
            <QrScanner onDetected={handleDetected} onError={handleCameraError} hint={t("scanHint")} />
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          {showInput && (<div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mist">
                {t("qrisFieldLabel")}
              </label>
              <textarea
                value={qris}
                disabled
                placeholder={t("qrisFieldPlaceholder")}
                rows={2}
                className="w-full resize-none rounded-xl border border-ink-line bg-ink-softer px-3.5 py-2.5 text-xs text-mist placeholder:text-mist/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-mist">
                {t("nameLabel")}
              </label>
              <input
                value={name}
                disabled
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-xl border border-ink-line bg-ink-softer px-3.5 py-2.5 text-sm text-mist outline-none placeholder:text-mist/50 focus:border-signal"
              />
            </div>
          </div>
          )}

          {error && <p className="text-sm text-signal">{error}</p>}

          <button
            type="button"
            onClick={handleSave}
            className="mt-1 w-full rounded-xl bg-signal py-3 text-sm font-semibold text-white active:scale-[0.99]"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
