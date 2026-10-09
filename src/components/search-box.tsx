"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type Suggestion = { name: string; slug: string; price: number; image: string | null };

export function SearchBox({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return;

    // Debounce typing, then fetch a few live suggestions.
    const timer = setTimeout(async () => {
      const safe = term.replace(/[%_,()]/g, " ");
      const { data } = await createClient()
        .from("products")
        .select("name, slug, price, product_images(url, sort_order)")
        .or(`name.ilike.%${safe}%,scent.ilike.%${safe}%`)
        .limit(5);
      setResults(
        (data ?? []).map((p) => ({
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          image: [...(p.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null,
        })),
      );
      setOpen(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  function done() {
    setOpen(false);
    setQuery("");
    setResults([]);
    onNavigate?.();
  }

  return (
    <div ref={wrapper} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const term = query.trim();
          router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
          done();
        }}
        className="flex items-center border-b border-line"
      >
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length < 2) {
              setResults([]);
              setOpen(false);
            }
          }}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Search products"
          autoComplete="off"
          className="w-full bg-transparent py-1.5 text-[12px] text-ink placeholder:text-muted focus:outline-none"
        />
        <button type="submit" aria-label="Search" className="p-1 text-ink hover:text-accent">
          <SearchIcon size={15} />
        </button>
      </form>

      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[85vw] bg-white p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          {results.length === 0 ? (
            <p className="px-2 py-3 text-[13px] text-muted">No candles found for “{query.trim()}”.</p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/products/${r.slug}`}
                    onClick={done}
                    className="flex items-center gap-3 rounded px-2 py-2 hover:bg-card"
                  >
                    <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-card">
                      {r.image && <Image src={r.image} alt="" fill sizes="40px" className="object-cover" />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-serif text-[13px] text-ink">{r.name}</span>
                      <span className="block text-[12px] font-medium text-body">{formatPrice(r.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={done}
            className="mt-1 block border-t border-line px-2 pt-2 text-[12px] font-semibold uppercase tracking-wider text-ink hover:text-accent"
          >
            See all results
          </Link>
        </div>
      )}
    </div>
  );
}
