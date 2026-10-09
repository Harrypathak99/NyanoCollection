import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card, td, th } from "../ui";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Products" };

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Products />
    </Suspense>
  );
}

type Row = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  is_special: boolean;
  category: { name: string } | null;
  images: { url: string; sort_order: number }[];
};

async function Products() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, stock, is_active, is_featured, is_special, category:categories(name), images:product_images(url, sort_order)")
    .order("sort_order")
    .order("name");
  const products = (data ?? []) as unknown as Row[];

  return (
    <>
      <AdminTitle
        title="Products"
        action={
          <Link href="/admin/products/new" className="btn-dark">
            Add product
          </Link>
        }
      />
      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-line bg-[#fbfaf9]">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>Category</th>
                <th className={th}>Price</th>
                <th className={th}>Stock</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => {
                const img = [...p.images].sort((a, b) => a.sort_order - b.sort_order)[0];
                return (
                  <tr key={p.id} className="hover:bg-[#fbfaf9]">
                    <td className={td}>
                      <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 hover:text-accent">
                        <span className="relative h-12 w-10 shrink-0 bg-card">
                          {img && <Image src={img.url} alt="" fill sizes="40px" className="object-cover" />}
                        </span>
                        <span className="font-medium">{p.name}</span>
                      </Link>
                    </td>
                    <td className={`${td} text-body`}>{p.category?.name ?? "—"}</td>
                    <td className={td}>{formatPrice(p.price)}</td>
                    <td className={`${td} ${p.stock === 0 ? "text-red-600" : p.stock < 6 ? "text-accent" : ""}`}>{p.stock}</td>
                    <td className={td}>
                      <span className="flex flex-wrap gap-1.5 text-[11px]">
                        <span className={`rounded-full px-2 py-0.5 ring-1 ${p.is_active ? "text-green-700 ring-green-200" : "text-muted ring-line"}`}>
                          {p.is_active ? "Active" : "Hidden"}
                        </span>
                        {p.is_featured && <span className="rounded-full px-2 py-0.5 text-sky-700 ring-1 ring-sky-200">Featured</span>}
                        {p.is_special && <span className="rounded-full px-2 py-0.5 text-accent ring-1 ring-orange-200">Special</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
