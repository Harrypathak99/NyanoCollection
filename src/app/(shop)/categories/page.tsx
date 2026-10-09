import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = { title: "Shop by categories" };

export default async function CategoriesPage() {
  "use cache";
  const categories = await getCategories();

  return (
    <>
      <PageHeader title="Shop by categories" crumbs={[{ label: "Categories" }]} />
      <section className="bg-sand py-14">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center bg-white px-6 pb-8 pt-7 text-center transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <h2 className="mb-5 text-[20px] group-hover:text-accent">{c.name}</h2>
              <span className="relative block aspect-square w-full max-w-[220px] overflow-hidden rounded-full bg-card">
                {c.image_url && (
                  <Image src={c.image_url} alt={c.name} fill sizes="220px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                )}
              </span>
              {c.description && <p className="mt-5 max-w-xs text-[13px] text-body">{c.description}</p>}
              <span className="mt-3 text-[12px] text-muted">{c.product_count} items</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
