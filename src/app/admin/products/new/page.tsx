import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card } from "../../ui";
import { ProductForm } from "../product-form";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <NewProduct />
    </Suspense>
  );
}

async function NewProduct() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order");

  return (
    <>
      <Link href="/admin/products" className="mb-4 inline-block text-[13px] text-muted hover:text-accent">
        ← All products
      </Link>
      <AdminTitle title="Add product" />
      <Card>
        <ProductForm categories={categories ?? []} />
      </Card>
    </>
  );
}
