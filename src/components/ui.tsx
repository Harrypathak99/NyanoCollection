import Link from "next/link";
import type { ReactNode } from "react";

/** The faint pink sprig drawn behind section titles in the design. */
export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 50" className={className} aria-hidden="true" fill="none" stroke="#efc6b4" strokeWidth="1.2" strokeLinecap="round">
      <path d="M8 46C20 34 32 20 52 4" />
      <path d="M20 34c-6-2-9-7-9-12 5 1 9 6 9 12Z" />
      <path d="M27 27c-5-3-7-8-6-13 5 2 8 7 6 13Z" />
      <path d="M34 20c-4-4-5-9-3-13 4 3 6 8 3 13Z" />
      <path d="M22 33c5 2 11 1 14-3-5-2-11-1-14 3Z" />
      <path d="M30 25c5 1 10-1 13-5-5-1-10 1-13 5Z" />
      <path d="M38 17c4 0 9-2 11-6-4-1-9 2-11 6Z" />
    </svg>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="relative mx-auto mb-10 max-w-4xl text-center lg:mb-14">
      <Sprig className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-16 -translate-x-1/2 -translate-y-1/2 opacity-70" />
      <h2 className="relative text-[24px] leading-snug text-ink sm:text-[28px] lg:text-[32px]">{children}</h2>
      {sub && <div className="relative mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-body">{sub}</div>}
    </div>
  );
}

export type Crumb = { label: string; href?: string };

export function PageHeader({ title, crumbs, children }: { title: string; crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <section className="bg-sand py-10 text-center lg:py-14">
      <div className="container-page">
        <nav aria-label="Breadcrumb" className="mb-3 text-[12px] text-muted">
          <ol className="flex flex-wrap items-center justify-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.href ? (
                  <Link href={c.href} className="hover:text-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="text-[30px] text-ink lg:text-[40px]">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: { label: string; href: string } }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <Sprig className="mx-auto mb-4 h-14 w-16" />
      <h2 className="mb-2 text-2xl">{title}</h2>
      <p className="mb-6 text-body">{text}</p>
      {action && (
        <Link href={action.href} className="btn-dark">
          {action.label}
        </Link>
      )}
    </div>
  );
}
