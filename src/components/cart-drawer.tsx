"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CloseIcon } from "@/components/icons";
import { QuantityInput } from "@/components/quantity-input";
import { useStore } from "@/components/store-provider";
import { FREE_SHIPPING_OVER, formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartSubtotal, updateQuantity, removeFromCart } = useStore();
  const remaining = Math.max(0, FREE_SHIPPING_OVER - cartSubtotal);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, setCartOpen]);

  const close = () => setCartOpen(false);

  return (
    <div className={`fixed inset-0 z-[60] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-xl">Your cart</h2>
          <button type="button" onClick={close} aria-label="Close cart">
            <CloseIcon size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-body">Your cart is empty.</p>
            <Link href="/shop" onClick={close} className="btn-dark">
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <p className="bg-blush px-6 py-3 text-[12px] text-body">
              {remaining > 0 ? (
                <>
                  Spend <strong className="text-ink">{formatPrice(remaining)}</strong> more for free shipping.
                </>
              ) : (
                <>You&apos;ve unlocked free shipping!</>
              )}
            </p>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {cart.map((item) => (
                <li key={item.productId + item.color} className="flex gap-4 py-5">
                  <Link href={`/products/${item.slug}`} onClick={close} className="relative h-24 w-20 shrink-0 bg-card">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/products/${item.slug}`} onClick={close} className="font-serif text-[15px] hover:text-accent">
                      {item.name}
                    </Link>
                    {item.color && (
                      <span className="mt-1 flex items-center gap-2 text-[12px] text-muted">
                        Color <span className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: item.color }} />
                      </span>
                    )}
                    <span className="mt-1 text-[13px] font-medium">{formatPrice(item.price)}</span>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <QuantityInput
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.productId, item.color, q)}
                        small
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.color)}
                        className="text-[12px] text-muted underline hover:text-accent"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-5">
              <div className="mb-1 flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="mb-4 text-[12px] text-muted">Delivery calculated at checkout. Pay cash on delivery.</p>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={close} className="btn-outline">
                  View cart
                </Link>
                <Link href="/checkout" onClick={close} className="btn-dark">
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
