"use client";

import { useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" className="flex flex-wrap justify-center gap-8 border-b border-line">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-3 font-serif text-[18px] transition-colors ${
              i === active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mx-auto max-w-3xl py-8">
        {tabs[active]?.content}
      </div>
    </div>
  );
}
