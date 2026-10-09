import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSkeleton, ProductListing, parseFilters } from "@/components/product-listing";
import { PageHeader } from "@/components/ui";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Shop all candles" };

export default function ShopPage({ searchParams }: PageProps<"/shop">) {
  return (
    <>
      <PageHeader title="Shop" crumbs={[{ label: "Shop" }]} />
      <Suspense fallback={<ListingSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({ searchParams }: { searchParams: PageProps<"/shop">["searchParams"] }) {
  const filters = parseFilters(await searchParams);
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);
  return <ProductListing products={products} categories={categories} filters={filters} />;
}
