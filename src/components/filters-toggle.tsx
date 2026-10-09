"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "@/components/icons";

/** Filters are always visible on desktop and collapsed behind a button on phones. */
export function FiltersToggle({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <aside>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border border-line px-4 py-3 text-[13px] font-medium uppercase tracking-wider lg:hidden"
      >
        Filters
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`${open ? "block" : "hidden"} space-y-8 pt-6 text-[13px] lg:block lg:pt-0`}>{children}</div>
    </aside>
  );
}
