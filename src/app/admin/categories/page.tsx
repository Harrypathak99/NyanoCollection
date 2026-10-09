import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card } from "../ui";
import { CategoryForm } from "./category-form";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Categories />
    </Suspense>
  );
}

async function Categories() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("id, name, slug, description, image_url, sort_order, is_active, products(count)")
    .order("sort_order");

  return (
    <>
      <AdminTitle title="Categories" />
      <p className="mb-6 max-w-2xl text-[13px] text-body">
        The first three categories (by sort order) appear in &ldquo;Shop by categories&rdquo; on the homepage. All active categories
        appear in the Shop menu.
      </p>
      <div className="space-y-4">
        {(data ?? []).map((c) => (
          <Card key={c.id}>
            <p className="mb-3 text-[13px] text-muted">
              {(c.products as unknown as { count: number }[])[0]?.count ?? 0} products
            </p>
            <CategoryForm category={c} />
          </Card>
        ))}
        <Card>
          <h2 className="mb-4 text-[18px]">Add category</h2>
          <CategoryForm />
        </Card>
      </div>
    </>
  );
}
