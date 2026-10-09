"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CompareIcon, HeartIcon } from "@/components/icons";
import { QuantityInput } from "@/components/quantity-input";
import { useStore } from "@/components/store-provider";
import type { Product } from "@/lib/types";

export function ProductPurchaseFromUrl({ product }: { product: Product }) {
  const color = useSearchParams().get("color");
  return <ProductPurchase product={product} initialColor={color} />;
}

export function ProductPurchase({ product, initialColor = null }: { product: Product; initialColor?: string | null }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare, setCartOpen } = useStore();
  const [color, setColor] = useState<string | null>(
    initialColor && product.colors.includes(initialColor) ? initialColor : (product.colors[0] ?? null),
  );
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock <= 0;
  const max = Math.max(1, Math.min(99, product.stock));
  const image = product.images[0]?.url ?? null;
  const saved = { productId: product.id, slug: product.slug, name: product.name, price: product.price, image };

  function add() {
    addToCart({ productId: product.id, slug: product.slug, name: product.name, price: product.price, image, color }, quantity);
  }

  return (
    <div>
      {product.colors.length > 0 && (
        <fieldset className="mb-6">
          <legend className="mb-3 text-[13px] text-body">Color</legend>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full ring-1 ring-offset-2 transition ${
                  color === c ? "ring-ink" : "ring-black/10 hover:ring-black/40"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </fieldset>
      )}

      <p className={`mb-4 text-[13px] ${soldOut ? "text-red-600" : product.stock < 6 ? "text-accent" : "text-green-700"}`}>
        {soldOut ? "Out of stock" : product.stock < 6 ? `Only ${product.stock} left in stock` : "In stock"}
      </p>

      <div className="flex flex-wrap gap-3">
        <QuantityInput value={quantity} onChange={(q) => setQuantity(Math.max(1, Math.min(max, q)))} max={max} />
        <button type="button" disabled={soldOut} onClick={add} className="btn-dark flex-1 !py-3.5">
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
      </div>

      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          add();
          setCartOpen(false);
          router.push("/checkout");
        }}
        className="btn-outline mt-3 w-full !py-3.5 disabled:opacity-50"
      >
        Buy it now — cash on delivery
      </button>

      <div className="mt-5 flex flex-wrap gap-6 text-[13px]">
        <button type="button" onClick={() => toggleWishlist(saved)} className="flex items-center gap-2 hover:text-accent">
          <HeartIcon size={15} filled={inWishlist(product.id)} />
          {inWishlist(product.id) ? "In your wishlist" : "Add to wishlist"}
        </button>
        <button type="button" onClick={() => toggleCompare(saved)} className="flex items-center gap-2 hover:text-accent">
          <CompareIcon size={15} />
          {inCompare(product.id) ? "Added to compare" : "Compare"}
        </button>
      </div>
    </div>
  );
}
