"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityInput } from "@/components/quantity-input";
import { useStore } from "@/components/store-provider";
import { EmptyState } from "@/components/ui";
import { FREE_SHIPPING_OVER, deliveryFeeFor, formatPrice } from "@/lib/format";

export function CartView() {
  const { ready, cart, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useStore();

  if (!ready) return <div className="container-page h-64" />;
  if (cart.length === 0) {
    return (
      <div className="container-page">
        <EmptyState title="Your cart is empty" text="Find a candle you love and it will show up here." action={{ label: "Shop candles", href: "/shop" }} />
      </div>
    );
  }

  const fee = deliveryFeeFor(cartSubtotal);

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="hidden grid-cols-[1fr_120px_140px_100px] border-b border-line pb-3 text-[12px] uppercase tracking-wider text-muted md:grid">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span className="text-right">Total</span>
        </div>
        <ul className="divide-y divide-line">
          {cart.map((item) => (
            <li key={item.productId + item.color} className="grid grid-cols-[80px_1fr] gap-4 py-6 md:grid-cols-[1fr_120px_140px_100px] md:items-center">
              <div className="contents md:flex md:items-center md:gap-4">
                <Link href={`/products/${item.slug}`} className="relative block h-24 w-20 shrink-0 bg-card">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
                </Link>
                <div>
                  <Link href={`/products/${item.slug}`} className="font-serif text-[16px] hover:text-accent">
                    {item.name}
                  </Link>
                  {item.color && (
                    <span className="mt-1 flex items-center gap-2 text-[12px] text-muted">
                      Color <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: item.color }} />
                    </span>
                  )}
                  <p className="mt-1 text-[13px] md:hidden">{formatPrice(item.price)}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.color)}
                    className="mt-2 text-[12px] text-muted underline hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <span className="hidden text-[14px] md:block">{formatPrice(item.price)}</span>
              <div className="col-start-2 md:col-start-auto">
                <QuantityInput value={item.quantity} onChange={(q) => updateQuantity(item.productId, item.color, q)} small />
              </div>
              <span className="hidden text-right text-[14px] font-medium md:block">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap justify-between gap-4">
          <Link href="/shop" className="link-wave !text-[11px]">
            Continue shopping
          </Link>
          <button type="button" onClick={clearCart} className="text-[12px] text-muted underline hover:text-accent">
            Clear cart
          </button>
        </div>
      </div>

      <aside className="h-fit bg-sand p-7">
        <h2 className="mb-5 text-[22px]">Order summary</h2>
        <dl className="space-y-3 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-body">Subtotal</dt>
            <dd>{formatPrice(cartSubtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-body">Delivery</dt>
            <dd>{fee === 0 ? "Free" : formatPrice(fee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[16px] font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(cartSubtotal + fee)}</dd>
          </div>
        </dl>
        {fee > 0 && (
          <p className="mt-4 text-[12px] text-body">
            Add {formatPrice(FREE_SHIPPING_OVER - cartSubtotal)} more for free delivery.
          </p>
        )}
        <Link href="/checkout" className="btn-dark mt-6 w-full !py-3.5">
          Proceed to checkout
        </Link>
        <p className="mt-3 text-center text-[12px] text-muted">Payment: cash on delivery</p>
      </aside>
    </div>
  );
}
