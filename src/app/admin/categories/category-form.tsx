"use client";

import { useActionState } from "react";
import { saveCategory } from "../actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export function CategoryForm({ category }: { category?: Category }) {
  const [state, action, pending] = useActionState(saveCategory, null);
  const id = category?.id ?? "new";

  return (
    <form action={action} className="grid gap-4 md:grid-cols-[1fr_1fr_100px]">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div>
        <label htmlFor={`${id}-name`} className="label">
          Name
        </label>
        <input id={`${id}-name`} name="name" required defaultValue={category?.name} className="input" />
      </div>
      <div>
        <label htmlFor={`${id}-slug`} className="label">
          URL slug
        </label>
        <input id={`${id}-slug`} name="slug" defaultValue={category?.slug} className="input" />
      </div>
      <div>
        <label htmlFor={`${id}-sort`} className="label">
          Sort order
        </label>
        <input id={`${id}-sort`} name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} className="input" />
      </div>
      <div className="md:col-span-2">
        <label htmlFor={`${id}-desc`} className="label">
          Description
        </label>
        <input id={`${id}-desc`} name="description" defaultValue={category?.description ?? ""} className="input" />
      </div>
      <label className="flex items-end gap-2 pb-3 text-[14px]">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} className="h-4 w-4 accent-[#e8834e]" />
        Active
      </label>
      <div className="md:col-span-3">
        <label htmlFor={`${id}-img`} className="label">
          Image URL
        </label>
        <input id={`${id}-img`} name="image_url" defaultValue={category?.image_url ?? ""} className="input" placeholder="https://…" />
      </div>
      <div className="flex items-center gap-4 md:col-span-3">
        <button type="submit" disabled={pending} className="btn-dark !py-2">
          {pending ? "Saving…" : category ? "Save" : "Add category"}
        </button>
        {state && <p className={`text-[13px] ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
      </div>
    </form>
  );
}
