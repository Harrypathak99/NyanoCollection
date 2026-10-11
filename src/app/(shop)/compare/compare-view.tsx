"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";
import { EmptyState } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type Details = {
  id: string;
  scent: string | null;
  burn_time: string | null;
  weight: string | null;
  stock: number;
  colors: string[];
  price: number;
  category: { name: string } | null;
};

export function CompareView() {
  const { ready, compare, toggleCompare, addToCart } = useStore();
  const [details, setDetails] = useState<Record<string, Details>>({});
  const ids = compare.map((c) => c.productId).join(",");

  useEffect(() => {
    if (!ids) return;
    createClient()
      .from("products")
      .select("id, scent, burn_time, weight, stock, colors, price, category:categories!products_category_id_fkey(name)")
      .in("id", ids.split(","))
      .then(({ data }) => {
        const map: Record<string, Details> = {};
        for (const row of (data ?? []) as unknown as Details[]) map[row.id] = row;
        setDetails(map);
      });
  }, [ids]);

  if (!ready) return <div className="container-page h-64" />;
  if (compare.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          title="Nothing to compare yet"
          text="Use the compare button on product cards to compare up to four candles side by side."
          action={{ label: "Browse candles", href: "/shop" }}
        />
      </div>
    );
  }

  const rows: [string, (d?: Details) => React.ReactNode][] = [
    ["Price", (d) => (d ? formatPrice(d.price) : "—")],
    ["Category", (d) => d?.category?.name ?? "—"],
    ["Scent", (d) => d?.scent ?? "—"],
    ["Burn time", (d) => d?.burn_time ?? "—"],
    ["Weight", (d) => d?.weight ?? "—"],
    [
      "Colors",
      (d) =>
        d?.colors.length ? (
          <span className="flex gap-1.5">
            {d.colors.map((c) => (
              <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
            ))}
          </span>
        ) : (
          "—"
        ),
    ],
    ["Availability", (d) => (d ? (d.stock > 0 ? "In stock" : "Out of stock") : "—")],
  ];

  return (
    <div className="container-page py-12">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
          <thead>
            <tr>
              <th className="w-36" />
              {compare.map((item) => (
                <th key={item.productId} className="px-4 pb-6 align-top font-normal">
                  <Link href={`/products/${item.slug}`} className="relative mb-3 block aspect-[3/4] w-full max-w-[180px] bg-card">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="180px" className="object-cover" />}
                  </Link>
                  <Link href={`/products/${item.slug}`} className="font-serif text-[16px] hover:text-accent">
                    {item.name}
                  </Link>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" onClick={() => addToCart({ ...item, color: details[item.productId]?.colors[0] ?? null })} className="btn-dark !px-4 !py-2 !text-[10px]">
                      Add to cart
                    </button>
                    <button type="button" onClick={() => toggleCompare(item)} className="text-[12px] text-muted underline hover:text-accent">
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, render]) => (
              <tr key={label} className="border-t border-line">
                <th scope="row" className="py-3 pr-4 font-medium text-body">
                  {label}
                </th>
                {compare.map((item) => (
                  <td key={item.productId} className="px-4 py-3">
                    {render(details[item.productId])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
