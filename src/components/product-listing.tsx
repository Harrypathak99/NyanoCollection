import Link from "next/link";
import { Suspense } from "react";
import { FiltersToggle } from "@/components/filters-toggle";
import { ProductCard } from "@/components/product-card";
import { SortSelect } from "@/components/sort-select";
import { EmptyState } from "@/components/ui";
import type { Category, Product } from "@/lib/types";

type Filters = { category?: string; sale?: boolean; min?: number; max?: number; sort?: string; q?: string };

const PRICE_RANGES = [
  { label: "Under Rs. 500", min: undefined, max: 500 },
  { label: "Rs. 500 – Rs. 1,000", min: 500, max: 1000 },
  { label: "Rs. 1,000 – Rs. 2,000", min: 1000, max: 2000 },
  { label: "Over Rs. 2,000", min: 2000, max: undefined },
];

/** Builds a /shop URL that keeps the current filters and applies `changes`. */
function shopHref(base: string, current: Filters, changes: Partial<Filters>) {
  const merged = { ...current, ...changes };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.category && base === "/shop") params.set("category", merged.category);
  if (merged.sale) params.set("sale", "1");
  if (merged.min != null) params.set("min", String(merged.min));
  if (merged.max != null) params.set("max", String(merged.max));
  if (merged.sort && merged.sort !== "featured") params.set("sort", merged.sort);
  return params.size ? `${base}?${params}` : base;
}

export function ProductListing({
  products,
  categories,
  filters,
  base = "/shop",
}: {
  products: Product[];
  categories: Category[];
  filters: Filters;
  base?: string;
}) {
  const hasFilters = filters.sale || filters.min != null || filters.max != null || (base === "/shop" && filters.category);

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[220px_1fr] lg:py-14">
      <FiltersToggle>
        <div>
          <h2 className="mb-3 text-[18px]">Categories</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href={shopHref("/shop", { ...filters, category: undefined }, {})}
                className={!filters.category ? "text-accent" : "text-body hover:text-accent"}
              >
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`flex justify-between ${filters.category === c.slug ? "text-accent" : "text-body hover:text-accent"}`}
                >
                  {c.name} <span className="text-muted">({c.product_count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-[18px]">Price</h2>
          <ul className="space-y-2">
            {PRICE_RANGES.map((r) => {
              const active = filters.min === r.min && filters.max === r.max;
              return (
                <li key={r.label}>
                  <Link
                    href={shopHref(base, filters, active ? { min: undefined, max: undefined } : { min: r.min, max: r.max })}
                    className={active ? "text-accent" : "text-body hover:text-accent"}
                    scroll={false}
                  >
                    {active ? "✓ " : ""}
                    {r.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-[18px]">Offers</h2>
          <Link
            href={shopHref(base, filters, { sale: !filters.sale })}
            scroll={false}
            className={filters.sale ? "text-accent" : "text-body hover:text-accent"}
          >
            {filters.sale ? "✓ " : ""}On sale
          </Link>
        </div>

        {hasFilters && (
          <Link href={base === "/shop" ? "/shop" : base} className="link-wave !text-[11px]">
            Clear filters
          </Link>
        )}
      </FiltersToggle>

      <div>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-body">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <Suspense fallback={<div className="h-9 w-48" />}>
            <SortSelect />
          </Suspense>
        </div>

        {products.length === 0 ? (
          <EmptyState
            title="No candles found"
            text="Try another category, price range or search term."
            action={{ label: "View all products", href: "/shop" }}
          />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function parseFilters(sp: Record<string, string | string[] | undefined>) {
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]![0] : sp[k]) as string | undefined;
  const num = (k: string) => {
    const v = one(k);
    const n = v == null || v === "" ? NaN : Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const sort = one("sort");
  return {
    q: one("q")?.slice(0, 100),
    category: one("category"),
    sale: one("sale") === "1",
    min: num("min"),
    max: num("max"),
    sort: (["featured", "newest", "price-asc", "price-desc", "name"].includes(sort ?? "") ? sort : "featured") as
      | "featured"
      | "newest"
      | "price-asc"
      | "price-desc"
      | "name",
  };
}

export function ListingSkeleton() {
  return (
    <div className="container-page grid animate-pulse grid-cols-2 gap-6 py-14 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] bg-card" />
          <div className="mt-3 h-4 w-3/4 bg-card" />
        </div>
      ))}
    </div>
  );
}
