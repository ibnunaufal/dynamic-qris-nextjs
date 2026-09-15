"use client";

import clsx from "clsx";
import type { Tab } from "@/types/qris";

interface Props {
  value: Tab;
  onChange: (tab: Tab) => void;
  staticLabel: string;
  dynamicLabel: string;
}

export function TabsSwitch({ value, onChange, staticLabel, dynamicLabel }: Props) {
  return (
    <div className="relative grid grid-cols-2 rounded-full bg-ink-softer p-1">
      <div
        className={clsx(
          "absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-signal transition-transform duration-300 ease-out",
          value === "dynamic" ? "translate-x-[calc(100%+8px)]" : "translate-x-0"
        )}
        aria-hidden
      />
      {(["static", "dynamic"] as Tab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={clsx(
            "relative z-10 rounded-full py-2.5 text-sm font-semibold tracking-wide transition-colors",
            value === tab ? "text-white" : "text-mist"
          )}
        >
          {tab === "static" ? staticLabel : dynamicLabel}
        </button>
      ))}
    </div>
  );
}
