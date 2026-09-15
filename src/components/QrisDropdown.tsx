"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Plus, Check } from "lucide-react";
import clsx from "clsx";
import type { SavedQris } from "@/types/qris";

interface Props {
  list: SavedQris[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddNew: () => void;
  addNewLabel: string;
}

export function QrisDropdown({ list, selectedId, onSelect, onAddNew, addNewLabel }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = list.find((q) => q.id === selectedId);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-ink-line bg-ink-soft px-3.5 py-2 text-sm font-medium text-white"
      >
        <span className="max-w-[120px] truncate">{selected?.name ?? "—"}</span>
        <ChevronDown size={16} className={clsx("text-mist transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-ink-line bg-ink-soft shadow-2xl shadow-black/40 animate-fade-in">
          <ul className="max-h-64 overflow-y-auto py-1">
            {list.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-white hover:bg-ink-softer"
                >
                  <span className="truncate">{item.name}</span>
                  {item.id === selectedId && <Check size={16} className="text-signal shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              onAddNew();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 border-t border-ink-line px-4 py-3 text-left text-sm font-medium text-signal hover:bg-ink-softer"
          >
            <Plus size={16} />
            {addNewLabel}
          </button>
        </div>
      )}
    </div>
  );
}
