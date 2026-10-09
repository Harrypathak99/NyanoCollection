"use client";

import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Pill button "ADD TO CART | $47.00" used in the special offer block. */
export function AddToCartPill({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const soldOut = product.stock <= 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() =>
        addToCart({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url ?? null,
          color: product.colors[0] ?? null,
        })
      }
      className="btn-dark !px-6 !py-2.5 !text-[11px]"
    >
      {soldOut ? "Sold out" : "Add to cart"}
      <span className="h-3 w-px bg-white/60" aria-hidden="true" />
      {formatPrice(product.price)}
    </button>
  );
}
