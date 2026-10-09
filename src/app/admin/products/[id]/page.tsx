import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteProduct, deleteProductImage } from "../../actions";
import { AdminSkeleton, AdminTitle, Card } from "../../ui";
import { ProductForm, type ProductFormValues } from "../product-form";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit product" };

export default function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: { params: PageProps<"/admin/products/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase.from("product_images").select("id, url, sort_order").eq("product_id", id).order("sort_order"),
  ]);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-block text-[13px] text-muted hover:text-accent">
        ← All products
      </Link>
      <AdminTitle
        title={product.name}
        action={
          <Link href={`/products/${product.slug}`} target="_blank" className="text-[13px] underline hover:text-accent">
            View in store ↗
          </Link>
        }
      />

      <Card className="mb-6">
        <h2 className="mb-4 text-[18px]">Images</h2>
        {(images ?? []).length === 0 ? (
          <p className="text-[14px] text-muted">No images yet. Upload some below.</p>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {(images ?? []).map((img) => (
              <li key={img.id} className="w-28">
                <span className="relative block aspect-[3/4] bg-card">
                  <Image src={img.url} alt="" fill sizes="112px" className="object-cover" />
                </span>
                <form action={deleteProductImage} className="mt-1 text-center">
                  <input type="hidden" name="imageId" value={img.id} />
                  <button type="submit" className="text-[12px] text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="mb-6">
        <ProductForm product={product as ProductFormValues} categories={categories ?? []} />
      </Card>

      <Card>
        <h2 className="mb-2 text-[18px]">Delete product</h2>
        <p className="mb-4 text-[13px] text-body">
          Past orders keep their copy of this product. To hide it without deleting, untick &ldquo;Visible in store&rdquo; above.
        </p>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className="rounded-full border border-red-600 px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-red-600 hover:bg-red-600 hover:text-white">
            Delete product
          </button>
        </form>
      </Card>
    </>
  );
}
