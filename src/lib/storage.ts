import type { Language, SavedQris } from "@/types/qris";

const KEY_SAVED_QRIS = "savedQris";
const KEY_SELECTED_ID = "selectedQrisId";
const KEY_LANGUAGE = "language";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getSavedQris(): SavedQris[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY_SAVED_QRIS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setSavedQris(list: SavedQris[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY_SAVED_QRIS, JSON.stringify(list));
}

export function addSavedQris(entry: Omit<SavedQris, "id">): SavedQris {
  const list = getSavedQris();
  const newEntry: SavedQris = { id: Date.now(), ...entry };
  setSavedQris([...list, newEntry]);
  return newEntry;
}

export function removeSavedQris(id: number): void {
  setSavedQris(getSavedQris().filter((item) => item.id !== id));
}

export function getSelectedQrisId(): number | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(KEY_SELECTED_ID);
  return raw ? Number(raw) : null;
}

export function setSelectedQrisId(id: number): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY_SELECTED_ID, String(id));
}

export function getStoredLanguage(): Language | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(KEY_LANGUAGE);
  return raw === "en" || raw === "id" ? raw : null;
}

export function setStoredLanguage(lang: Language): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY_LANGUAGE, lang);
}
