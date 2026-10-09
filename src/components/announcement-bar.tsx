import Link from "next/link";
import { ANNOUNCEMENTS } from "@/lib/site";

export function AnnouncementBar() {
  // Repeat the list so the marquee loops without a gap.
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div className="overflow-hidden bg-peach py-2 text-[11px] font-medium uppercase tracking-[0.04em] text-accent">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <li key={`${copy}-${i}`} className="px-7">
                <Link href={item.href} tabIndex={copy === 1 ? -1 : undefined} className="hover:text-ink">
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
