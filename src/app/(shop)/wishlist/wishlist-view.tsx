"use client";

import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { EmptyState } from "@/components/ui";
import { formatPrice } from "@/lib/format";

export function WishlistView() {
  const { ready, wishlist, toggleWishlist, addToCart } = useStore();

  if (!ready) return <div className="container-page h-64" />;
  if (wishlist.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          title="Your wishlist is empty"
          text="Tap the heart on any candle to save it here for later."
          action={{ label: "Discover candles", href: "/shop" }}
        />
      </div>
    );
  }

  return (
    <div className="container-page grid grid-cols-2 gap-x-4 gap-y-10 py-12 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {wishlist.map((item) => (
        <article key={item.productId} className="group relative">
          <Link href={`/products/${item.slug}`} className="relative block aspect-[3/4] overflow-hidden bg-card">
            {item.image && (
              <Image src={item.image} alt={item.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
          </Link>
          <button
            type="button"
            aria-label={`Remove ${item.name} from wishlist`}
            onClick={() => toggleWishlist(item)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm hover:bg-ink hover:text-white"
          >
            <CloseIcon size={14} />
          </button>
          <h2 className="mt-3 font-serif text-[15px]">
            <Link href={`/products/${item.slug}`} className="hover:text-accent">
              {item.name}
            </Link>
          </h2>
          <p className="mt-1 text-[13px] font-medium">{formatPrice(item.price)}</p>
          <button
            type="button"
            onClick={() => addToCart({ ...item, color: null })}
            className="btn-outline mt-3 w-full !py-2 !text-[11px]"
          >
            Add to cart
          </button>
        </article>
      ))}
    </div>
  );
}
