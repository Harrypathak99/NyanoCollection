import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import type { Category, Product, SortOption } from "@/lib/types";

// Catalog reads are cached and tagged. Admin edits and new orders call
// updateTag("products") / updateTag("categories") to refresh them.

const PRODUCT_SELECT = `
  id, name, slug, short_description, description, price, compare_at_price, stock, colors,
  scent, burn_time, weight, is_featured, is_special, special_ends_at, sort_order, created_at,
  category:categories!products_category_id_fkey(name, slug),
  links:product_categories(category:categories(name, slug)),
  images:product_images(url, alt, sort_order)
`;

type ProductRow = Omit<Product, "price" | "compare_at_price" | "categories"> & {
  price: number | string;
  compare_at_price: number | string | null;
  links: { category: { name: string; slug: string } | null }[] | null;
};

function normalize({ links, ...row }: ProductRow): Product {
  const categories = (links ?? []).flatMap((l) => (l.category ? [l.category] : []));
  // Main category first, then the rest alphabetically.
  categories.sort((a, b) => Number(b.slug === row.category?.slug) - Number(a.slug === row.category?.slug) || a.name.localeCompare(b.name));
  return {
    ...row,
    categories: categories.length ? categories : row.category ? [row.category] : [],
    price: Number(row.price),
    compare_at_price: row.compare_at_price == null ? null : Number(row.compare_at_price),
    images: [...(row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

function sortProducts(products: Product[], sort: SortOption) {
  const list = [...products];
  switch (sort) {
    case "newest":
      return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order);
  }
}

export async function getAllProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .order("sort_order")
    .order("name");
  if (error) throw new Error(error.message);
  return (data as unknown as ProductRow[]).map(normalize);
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag("categories");
  cacheTag("products");
  cacheLife("hours");

  const { data, error } = await createPublicClient()
    .from("categories")
    .select("id, name, slug, description, image_url, sort_order, product_categories(count)")
    .order("sort_order");
  if (error) throw new Error(error.message);

  return (data ?? []).map(({ product_categories, ...c }) => ({
    ...c,
    product_count: (product_categories as unknown as { count: number }[])[0]?.count ?? 0,
  }));
}

export async function getCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export type ProductFilters = {
  category?: string;
  sort?: SortOption;
  sale?: boolean;
  min?: number;
  max?: number;
  q?: string;
};

export async function getProducts(filters: ProductFilters = {}) {
  const all = await getAllProducts();
  const q = filters.q?.trim().toLowerCase();

  const filtered = all.filter((p) => {
    if (filters.category && !p.categories.some((c) => c.slug === filters.category)) return false;
    if (filters.sale && !(p.compare_at_price && p.compare_at_price > p.price)) return false;
    if (filters.min != null && p.price < filters.min) return false;
    if (filters.max != null && p.price > filters.max) return false;
    if (q) {
      const haystack = [p.name, p.short_description, p.scent, ...p.categories.map((c) => c.name)].join(" ").toLowerCase();
      if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    return true;
  });

  return sortProducts(filtered, filters.sort ?? "featured");
}

export async function getFeaturedProducts(limit = 8) {
  const all = await getAllProducts();
  return all.filter((p) => p.is_featured).slice(0, limit);
}

export async function getSpecialProduct() {
  const all = await getAllProducts();
  return all.find((p) => p.is_special) ?? null;
}

export async function getProduct(slug: string) {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const all = await getAllProducts();
  const slugs = new Set(product.categories.map((c) => c.slug));
  const shares = (p: Product) => p.categories.some((c) => slugs.has(c.slug));
  const sameCategory = all.filter((p) => p.id !== product.id && shares(p));
  const others = all.filter((p) => p.id !== product.id && !shares(p));
  return [...sameCategory, ...others].slice(0, limit);
}
