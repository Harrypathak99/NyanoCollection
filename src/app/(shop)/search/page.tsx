import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchIcon } from "@/components/icons";
import { ListingSkeleton, ProductListing, parseFilters } from "@/components/product-listing";
import { PageHeader } from "@/components/ui";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense
      fallback={
        <>
          <PageHeader title="Search" crumbs={[{ label: "Search" }]} />
          <ListingSkeleton />
        </>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchResults({ searchParams }: { searchParams: PageProps<"/search">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  const [products, categories] = await Promise.all([
    filters.q ? getProducts(filters) : Promise.resolve([]),
    getCategories(),
  ]);

  return (
    <>
      <PageHeader title={filters.q ? `Results for “${filters.q}”` : "Search"} crumbs={[{ label: "Search" }]}>
        <form action="/search" role="search" className="mx-auto mt-6 flex max-w-md items-center border-b border-ink">
          <label htmlFor="search-page-q" className="sr-only">
            Search products
          </label>
          <input
            id="search-page-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search candles, scents, categories…"
            className="flex-1 bg-transparent py-2 text-[15px] focus:outline-none"
          />
          <button type="submit" aria-label="Search" className="p-2 hover:text-accent">
            <SearchIcon />
          </button>
        </form>
      </PageHeader>
      {filters.q ? (
        <ProductListing products={products} categories={categories} filters={filters} base="/search" />
      ) : (
        <p className="container-page py-16 text-center text-body">Type a candle name, scent or category to search.</p>
      )}
    </>
  );
}
