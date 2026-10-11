"use client";

import { useActionState } from "react";
import { saveProduct } from "../actions";

export type ProductFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  category_id?: string | null;
  category_ids?: string[];
  short_description?: string | null;
  description?: string | null;
  price?: number;
  compare_at_price?: number | null;
  stock?: number;
  colors?: string[];
  scent?: string | null;
  burn_time?: string | null;
  weight?: string | null;
  is_active?: boolean;
  is_featured?: boolean;
  is_special?: boolean;
  special_ends_at?: string | null;
  sort_order?: number;
};

export function ProductForm({
  product = {},
  categories,
}: {
  product?: ProductFormValues;
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const endsAt = product.special_ends_at ? product.special_ends_at.slice(0, 16) : "";

  return (
    <form action={action} className="grid gap-5 md:grid-cols-2">
      {product.id && <input type="hidden" name="id" value={product.id} />}
      <Field label="Name *" name="name" defaultValue={product.name} required />
      <Field label="URL slug (leave blank to generate)" name="slug" defaultValue={product.slug} />
      <Field label="Stock *" name="stock" type="number" min={0} defaultValue={product.stock ?? 0} required />
      <fieldset className="md:col-span-2">
        <legend className="label">Categories (select one or more)</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2 rounded border border-line px-4 py-3">
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-[14px]">
              <input
                type="checkbox"
                name="category_ids"
                value={c.id}
                defaultChecked={(product.category_ids ?? []).includes(c.id)}
                className="h-4 w-4 accent-[#e8834e]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label="Price *" name="price" type="number" step="0.01" min={0} defaultValue={product.price} required />
      <Field label="Compare-at price (shows as sale)" name="compare_at_price" type="number" step="0.01" min={0} defaultValue={product.compare_at_price ?? ""} />
      <Field label="Short description" name="short_description" defaultValue={product.short_description ?? ""} className="md:col-span-2" />
      <div className="md:col-span-2">
        <label htmlFor="description" className="label">
          Full description
        </label>
        <textarea id="description" name="description" rows={5} defaultValue={product.description ?? ""} className="input" />
      </div>
      <Field label="Scent" name="scent" defaultValue={product.scent ?? ""} />
      <Field label="Colors (hex codes, e.g. #7ba7d9, #f5d36b)" name="colors" defaultValue={(product.colors ?? []).join(", ")} />
      <Field label="Burn time" name="burn_time" defaultValue={product.burn_time ?? ""} placeholder="45–50 hours" />
      <Field label="Weight" name="weight" defaultValue={product.weight ?? ""} placeholder="320 g" />

      <div className="md:col-span-2">
        <label htmlFor="images" className="label">
          Upload images (JPG, PNG or WebP, up to 5 MB each)
        </label>
        <input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="input" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor="image_urls" className="label">
          …or paste image URLs (one per line)
        </label>
        <textarea id="image_urls" name="image_urls" rows={2} className="input" placeholder="https://images.unsplash.com/photo-…" />
      </div>

      <fieldset className="flex flex-wrap gap-6 md:col-span-2">
        <legend className="label">Visibility</legend>
        <Check name="is_active" label="Visible in store" defaultChecked={product.is_active ?? true} />
        <Check name="is_featured" label="Featured on homepage" defaultChecked={product.is_featured ?? false} />
        <Check name="is_special" label="Homepage special offer" defaultChecked={product.is_special ?? false} />
      </fieldset>
      <Field label="Special offer ends at" name="special_ends_at" type="datetime-local" defaultValue={endsAt} />
      <Field label="Display order (lower shows first)" name="sort_order" type="number" defaultValue={product.sort_order ?? 0} />

      <div className="flex items-center gap-4 md:col-span-2">
        <button type="submit" disabled={pending} className="btn-dark">
          {pending ? "Saving…" : product.id ? "Save product" : "Create product"}
        </button>
        {state && <p className={`text-[13px] ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  className = "",
  ...props
}: { label: string; name: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input id={name} name={name} className="input" {...props} />
    </div>
  );
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-[14px]">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[#e8834e]" />
      {label}
    </label>
  );
}
