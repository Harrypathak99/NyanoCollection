"use client";

import Image from "next/image";
import Link from "next/link";
import { BagIcon, CompareIcon, HeartIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, inWishlist, toggleCompare, inCompare } = useStore();
  const [first, second] = product.images;
  const href = `/products/${product.slug}`;
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const soldOut = product.stock <= 0;
  const saved = { productId: product.id, slug: product.slug, name: product.name, price: product.price, image: first?.url ?? null };

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        <Link href={href} aria-label={product.name} className="absolute inset-0">
          {first && (
            <Image
              src={first.url}
              alt={first.alt ?? product.name}
              fill
              priority={priority}
              sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${second ? "group-hover:opacity-0" : ""}`}
            />
          )}
          {second && (
            <Image
              src={second.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
              className="object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          )}
        </Link>

        {(onSale || soldOut) && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ${
              soldOut ? "bg-ink" : "bg-accent"
            }`}
          >
            {soldOut ? "Sold out" : "Sale"}
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 lg:translate-x-3 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
          <IconButton
            label={inWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            active={inWishlist(product.id)}
            onClick={() => toggleWishlist(saved)}
          >
            <HeartIcon size={15} filled={inWishlist(product.id)} />
          </IconButton>
          <IconButton
            label={inCompare(product.id) ? "Remove from compare" : "Add to compare"}
            active={inCompare(product.id)}
            onClick={() => toggleCompare(saved)}
          >
            <CompareIcon size={15} />
          </IconButton>
        </div>

        {!soldOut && (
          <button
            type="button"
            onClick={() =>
              addToCart({
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: first?.url ?? null,
                color: product.colors[0] ?? null,
              })
            }
            className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-white/95 py-2 text-[11px] font-semibold uppercase tracking-wider text-ink shadow-sm transition-all duration-300 hover:bg-ink hover:text-white lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          >
            <BagIcon size={13} /> Add to cart
          </button>
        )}
      </div>

      <div className="pt-3">
        <h3 className="font-serif text-[14px] leading-snug text-body">
          <Link href={href} className="transition-colors hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 flex items-center gap-2 text-[13px] font-medium text-ink">
          {formatPrice(product.price)}
          {onSale && <s className="font-normal text-muted">{formatPrice(product.compare_at_price!)}</s>}
        </p>
        {product.colors.length > 0 && (
          <ul className="mt-3 flex gap-1.5" aria-label="Available colors">
            {product.colors.map((color) => (
              <li key={color}>
                <Link
                  href={`${href}?color=${encodeURIComponent(color)}`}
                  aria-label={`Color ${color}`}
                  className="block h-[13px] w-[13px] rounded-full ring-1 ring-black/5 transition-transform hover:scale-125"
                  style={{ backgroundColor: color }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
        active ? "bg-accent text-white" : "bg-white text-ink hover:bg-ink hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
