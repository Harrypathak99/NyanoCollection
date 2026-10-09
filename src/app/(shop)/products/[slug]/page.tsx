import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CashIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase, ProductPurchaseFromUrl } from "@/components/product-purchase";
import { Tabs } from "@/components/tabs";
import { SectionTitle } from "@/components/ui";
import { getAllProducts, getProduct, getRelatedProducts } from "@/lib/data";
import { DELIVERY_FEE, FREE_SHIPPING_OVER, formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.short_description ?? undefined,
    openGraph: { images: product.images[0]?.url ? [product.images[0].url] : [] },
  };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  return <ProductView slug={slug} />;
}

async function ProductView({ slug }: { slug: string }) {
  "use cache";
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;

  const details = [
    ["Category", product.category?.name],
    ["Scent", product.scent],
    ["Burn time", product.burn_time],
    ["Weight", product.weight],
    ["Wax", "Natural soy wax"],
    ["Wick", "Lead-free cotton"],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <div className="container-page pt-6">
        <nav aria-label="Breadcrumb" className="text-[12px] text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-accent">
                Shop
              </Link>
            </li>
            {product.category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/category/${product.category.slug}`} className="hover:text-accent">
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="text-ink">{product.name}</li>
          </ol>
        </nav>
      </div>

      <section className="container-page grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="lg:pt-4">
          {product.category && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent hover:text-ink"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mb-4 mt-2 text-[30px] leading-tight lg:text-[38px]">{product.name}</h1>
          <p className="mb-5 flex items-baseline gap-3 text-[22px] font-medium">
            {formatPrice(product.price)}
            {onSale && (
              <>
                <s className="text-[16px] font-normal text-muted">{formatPrice(product.compare_at_price!)}</s>
                <span className="rounded-full bg-peach px-2.5 py-0.5 text-[11px] font-medium text-accent">
                  Save {formatPrice(product.compare_at_price! - product.price)}
                </span>
              </>
            )}
          </p>
          {product.short_description && <p className="mb-7 leading-relaxed text-body">{product.short_description}</p>}

          <Suspense fallback={<ProductPurchase product={product} />}>
            <ProductPurchaseFromUrl product={product} />
          </Suspense>

          <ul className="mt-8 space-y-3 border-t border-line pt-6 text-[13px] text-body">
            <li className="flex items-center gap-3">
              <CashIcon size={18} className="text-ink" /> Cash on delivery — pay when your candles arrive.
            </li>
            <li className="flex items-center gap-3">
              <TruckIcon size={18} className="text-ink" /> Free delivery on orders over {formatPrice(FREE_SHIPPING_OVER)}, otherwise{" "}
              {formatPrice(DELIVERY_FEE)}.
            </li>
          </ul>
        </div>
      </section>

      <section className="container-page pb-8">
        <Tabs
          tabs={[
            {
              label: "Description",
              content: <p className="leading-relaxed text-body">{product.description ?? product.short_description}</p>,
            },
            {
              label: "Details",
              content: (
                <dl className="grid grid-cols-[auto_1fr] gap-x-10 gap-y-3 text-[14px]">
                  {details.map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
            {
              label: "Shipping",
              content: (
                <div className="space-y-3 leading-relaxed text-body">
                  <p>
                    We deliver within 2–5 working days. Orders over {formatPrice(FREE_SHIPPING_OVER)} ship free; smaller orders have a{" "}
                    {formatPrice(DELIVERY_FEE)} delivery fee.
                  </p>
                  <p>
                    Payment is cash on delivery. We&apos;ll call to confirm your order before it ships.{" "}
                    <Link href="/shipping" className="text-ink underline hover:text-accent">
                      Read our shipping & returns policy
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
          ]}
        />
      </section>

      {related.length > 0 && (
        <section className="container-page pb-20">
          <SectionTitle>You may also like</SectionTitle>
          <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-page grid animate-pulse gap-10 py-14 lg:grid-cols-2">
      <div className="aspect-[4/5] bg-card" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-24 bg-card" />
        <div className="h-10 w-3/4 bg-card" />
        <div className="h-6 w-32 bg-card" />
        <div className="h-20 bg-card" />
      </div>
    </div>
  );
}
