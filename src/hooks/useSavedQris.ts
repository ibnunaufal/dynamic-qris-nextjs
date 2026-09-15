"use client";

import { useCallback, useEffect, useState } from "react";
import type { SavedQris } from "@/types/qris";
import {
  addSavedQris,
  getSavedQris,
  getSelectedQrisId,
  removeSavedQris,
  setSelectedQrisId,
} from "@/lib/storage";

export function useSavedQris() {
  const [list, setList] = useState<SavedQris[]>([]);
  const [selectedId, setSelectedIdState] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getSavedQris();
    setList(stored);
    const storedSelected = getSelectedQrisId();
    const validSelected = stored.find((q) => q.id === storedSelected)?.id ?? stored[0]?.id ?? null;
    setSelectedIdState(validSelected);
    setReady(true);
  }, []);

  const selectQris = useCallback((id: number) => {
    setSelectedIdState(id);
    setSelectedQrisId(id);
  }, []);

  const addQris = useCallback((entry: { name: string; qris: string }) => {
    const created = addSavedQris(entry);
    setList((prev) => [...prev, created]);
    setSelectedIdState(created.id);
    setSelectedQrisId(created.id);
    return created;
  }, []);

  const deleteQris = useCallback(
    (id: number) => {
      removeSavedQris(id);
      setList((prev) => {
        const next = prev.filter((q) => q.id !== id);
        if (selectedId === id) {
          const fallback = next[0]?.id ?? null;
          setSelectedIdState(fallback);
          if (fallback) setSelectedQrisId(fallback);
        }
        return next;
      });
    },
    [selectedId]
  );

  const selected = list.find((q) => q.id === selectedId) ?? null;

  return { list, selected, selectedId, selectQris, addQris, deleteQris, ready };
}
