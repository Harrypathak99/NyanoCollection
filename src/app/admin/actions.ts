"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type AdminState = { ok: boolean; message: string } | null;

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Not allowed");
}

export async function setOrderStatus(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await assertAdmin();
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_order_status", {
    p_order_id: String(formData.get("orderId")),
    p_status: String(formData.get("status")),
  });
  if (error) return { ok: false, message: error.message };
  updateTag("products"); // cancelling changes stock
  return { ok: true, message: "Status updated." };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const HEX_RE = /^#[0-9a-f]{6}$/i;

export async function saveProduct(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await assertAdmin();
  const supabase = await createClient();
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const id = get("id");

  const name = get("name");
  const price = Number(get("price"));
  const compare = get("compare_at_price") ? Number(get("compare_at_price")) : null;
  const stock = Math.floor(Number(get("stock")));
  if (!name) return { ok: false, message: "Name is required." };
  if (!Number.isFinite(price) || price < 0) return { ok: false, message: "Enter a valid price." };
  if (compare != null && (!Number.isFinite(compare) || compare < 0)) return { ok: false, message: "Enter a valid compare-at price." };
  if (!Number.isFinite(stock) || stock < 0) return { ok: false, message: "Enter a valid stock number." };

  const colors = get("colors")
    .split(/[\s,]+/)
    .filter((c) => HEX_RE.test(c));

  // Several categories can be ticked. The main one (breadcrumbs, product page label)
  // stays the same while it's still ticked; otherwise it becomes the first ticked one.
  const categoryIds = [...new Set(formData.getAll("category_ids").map(String).filter(Boolean))];
  let mainCategory = categoryIds[0] ?? null;
  if (id && categoryIds.length) {
    const { data: current } = await supabase.from("products").select("category_id").eq("id", id).maybeSingle();
    if (current?.category_id && categoryIds.includes(current.category_id)) mainCategory = current.category_id;
  }

  const row = {
    name,
    slug: slugify(get("slug") || name),
    category_id: mainCategory,
    short_description: get("short_description") || null,
    description: get("description") || null,
    price,
    compare_at_price: compare,
    stock,
    colors,
    scent: get("scent") || null,
    burn_time: get("burn_time") || null,
    weight: get("weight") || null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_special: formData.get("is_special") === "on",
    special_ends_at: get("special_ends_at") ? new Date(get("special_ends_at")).toISOString() : null,
    sort_order: Math.floor(Number(get("sort_order")) || 0),
  };

  const result = id
    ? await supabase.from("products").update(row).eq("id", id).select("id").single()
    : await supabase.from("products").insert(row).select("id").single();
  if (result.error) {
    return { ok: false, message: result.error.code === "23505" ? "That URL slug is already used by another product." : result.error.message };
  }
  const productId = result.data.id as string;

  // Replace the product's category links with the ticked ones.
  const unlink = await supabase.from("product_categories").delete().eq("product_id", productId);
  if (unlink.error) return { ok: false, message: `Could not update categories: ${unlink.error.message}` };
  if (categoryIds.length) {
    const link = await supabase
      .from("product_categories")
      .insert(categoryIds.map((category_id) => ({ product_id: productId, category_id })));
    if (link.error) return { ok: false, message: `Could not update categories: ${link.error.message}` };
  }

  // Only one product can be the homepage special offer.
  if (row.is_special) await supabase.from("products").update({ is_special: false }).neq("id", productId).eq("is_special", true);

  // Uploaded image files go to Supabase Storage.
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const { count } = await supabase.from("product_images").select("id", { count: "exact", head: true }).eq("product_id", productId);
  let order = count ?? 0;
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) return { ok: false, message: `${file.name} is larger than 5 MB.` };
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${productId}/${Date.now()}-${order}.${ext}`;
    const upload = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
    if (upload.error) return { ok: false, message: `Upload failed: ${upload.error.message}` };
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    await supabase.from("product_images").insert({ product_id: productId, url: data.publicUrl, alt: name, sort_order: order++ });
  }

  // Image URLs pasted in (e.g. from Unsplash)
  const urls = get("image_urls")
    .split(/\s+/)
    .filter((u) => u.startsWith("https://"));
  for (const url of urls) {
    await supabase.from("product_images").insert({ product_id: productId, url, alt: name, sort_order: order++ });
  }

  updateTag("products");
  if (!id) redirect(`/admin/products/${productId}?created=1`);
  return { ok: true, message: "Product saved." };
}

export async function deleteProductImage(formData: FormData) {
  await assertAdmin();
  const supabase = await createClient();
  const imageId = String(formData.get("imageId"));
  const { data } = await supabase.from("product_images").delete().eq("id", imageId).select("url").single();

  const marker = "/object/public/product-images/";
  if (data?.url?.includes(marker)) {
    await supabase.storage.from("product-images").remove([data.url.split(marker)[1]]);
  }
  updateTag("products");
}

/** Deletes a product and its uploaded photos. Past orders keep their item snapshot. */
async function removeProductById(id: string): Promise<AdminState> {
  await assertAdmin();
  const supabase = await createClient();

  const { data: images } = await supabase.from("product_images").select("url").eq("product_id", id);
  const { data: deleted, error } = await supabase.from("products").delete().eq("id", id).select("id");
  if (error) return { ok: false, message: error.message };
  if (!deleted?.length) return { ok: false, message: "Product not found or already deleted." };

  const marker = "/object/public/product-images/";
  const paths = (images ?? []).filter((i) => i.url.includes(marker)).map((i) => i.url.split(marker)[1]);
  if (paths.length) await supabase.storage.from("product-images").remove(paths);

  updateTag("products");
  return { ok: true, message: "Product deleted." };
}

export async function deleteProductById(id: string): Promise<AdminState> {
  return removeProductById(id);
}

export async function deleteProduct(formData: FormData) {
  const result = await removeProductById(String(formData.get("id")));
  if (result?.ok) redirect("/admin/products");
}

export async function saveCategory(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await assertAdmin();
  const supabase = await createClient();
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const id = get("id");
  const name = get("name");
  if (!name) return { ok: false, message: "Name is required." };

  const row = {
    name,
    slug: slugify(get("slug") || name),
    description: get("description") || null,
    image_url: get("image_url") || null,
    sort_order: Number(get("sort_order")) || 0,
    is_active: formData.get("is_active") === "on",
  };
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);
  if (error) return { ok: false, message: error.code === "23505" ? "That slug is already used." : error.message };

  updateTag("categories");
  updateTag("products");
  return { ok: true, message: id ? "Category saved." : "Category added." };
}
