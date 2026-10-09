import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingSkeleton, ProductListing, parseFilters } from "@/components/product-listing";
import { PageHeader } from "@/components/ui";
import { getCategories, getCategory, getProducts } from "@/lib/data";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? "Category not found", description: category?.description ?? undefined };
}

export default function CategoryPage({ params, searchParams }: PageProps<"/category/[slug]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <CategoryResults params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryResults({
  params,
  searchParams,
}: {
  params: PageProps<"/category/[slug]">["params"];
  searchParams: PageProps<"/category/[slug]">["searchParams"];
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = await getCategory(slug);
  if (!category) notFound();

  const filters = { ...parseFilters(sp), category: slug };
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);

  return (
    <>
      <PageHeader title={category.name} crumbs={[{ label: "Shop", href: "/shop" }, { label: category.name }]}>
        {category.description && <p className="mx-auto mt-3 max-w-lg text-[14px] text-body">{category.description}</p>}
      </PageHeader>
      <ProductListing products={products} categories={categories} filters={filters} base={`/category/${slug}`} />
    </>
  );
}
