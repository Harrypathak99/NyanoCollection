"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number[] | null>(null);

  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(parts(end - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const labels = ["Days", "Hours", "Minutes", "Seconds"];
  const values = left ?? [0, 0, 0, 0];

  return (
    <div className="flex items-start justify-center gap-3 font-serif text-rust" role="timer" aria-label="Offer ends in">
      {values.map((v, i) => (
        <div key={labels[i]} className="flex items-start gap-3">
          <div className="text-center">
            <span className="block text-[28px] leading-none tabular-nums lg:text-[32px]">
              {left ? String(v).padStart(2, "0") : "--"}
            </span>
            <span className="mt-1 block font-sans text-[10px] uppercase tracking-wider text-muted">{labels[i]}</span>
          </div>
          {i < 3 && <span className="text-[22px] leading-none text-muted">:</span>}
        </div>
      ))}
    </div>
  );
}
