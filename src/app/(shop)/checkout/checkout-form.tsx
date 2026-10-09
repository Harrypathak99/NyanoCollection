"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { placeOrder } from "./actions";
import { CashIcon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { EmptyState } from "@/components/ui";
import { deliveryFeeFor, formatPrice } from "@/lib/format";

type Defaults = Partial<Record<"name" | "phone" | "email" | "address" | "city", string>>;

export function CheckoutForm({ defaults, signedIn }: { defaults: Defaults; signedIn: boolean }) {
  const { ready, cart, cartSubtotal } = useStore();
  const [state, action, pending] = useActionState(placeOrder, null);
  const values = { ...defaults, ...state?.fields };

  if (!ready) return <div className="container-page h-64" />;
  if (cart.length === 0) {
    return (
      <div className="container-page">
        <EmptyState title="Your cart is empty" text="Add some candles before checking out." action={{ label: "Shop candles", href: "/shop" }} />
      </div>
    );
  }

  const fee = deliveryFeeFor(cartSubtotal);
  const items = JSON.stringify(cart.map((i) => ({ productId: i.productId, color: i.color, quantity: i.quantity })));

  return (
    <form action={action} className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_400px]">
      <div>
        {!signedIn && (
          <p className="mb-6 bg-blush px-4 py-3 text-[13px] text-body">
            Have an account?{" "}
            <Link href="/account/login?next=/checkout" className="font-medium text-ink underline hover:text-accent">
              Log in
            </Link>{" "}
            to track your orders. You can also check out as a guest.
          </p>
        )}

        <h2 className="mb-5 text-[22px]">Delivery details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name *" name="name" defaultValue={values.name} required autoComplete="name" />
          <Field label="Phone number *" name="phone" type="tel" defaultValue={values.phone} required autoComplete="tel" placeholder="98XXXXXXXX" />
          <Field label="Email (for order updates)" name="email" type="email" defaultValue={values.email} autoComplete="email" className="sm:col-span-2" />
          <Field label="Address *" name="address" defaultValue={values.address} required autoComplete="street-address" className="sm:col-span-2" placeholder="Street, area, landmark" />
          <Field label="City *" name="city" defaultValue={values.city} required autoComplete="address-level2" />
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="label">
              Order notes (optional)
            </label>
            <textarea id="notes" name="notes" rows={3} maxLength={1000} defaultValue={state?.fields?.notes} className="input" placeholder="Delivery time, gift message…" />
          </div>
        </div>

        {/* Bot trap: hidden from people */}
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>
            Company <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="items" value={items} />

        <h2 className="mb-4 mt-10 text-[22px]">Payment</h2>
        <div className="flex items-start gap-4 border border-ink p-4">
          <CashIcon size={22} className="mt-0.5" />
          <div>
            <p className="font-medium">Cash on delivery</p>
            <p className="text-[13px] text-body">Pay in cash when your order arrives. We&apos;ll call you to confirm before shipping.</p>
          </div>
        </div>
      </div>

      <aside className="h-fit bg-sand p-7">
        <h2 className="mb-5 text-[22px]">Your order</h2>
        <ul className="mb-5 space-y-4">
          {cart.map((item) => (
            <li key={item.productId + item.color} className="flex items-center gap-4">
              <span className="relative h-16 w-14 shrink-0 bg-white">
                {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                  {item.quantity}
                </span>
              </span>
              <span className="flex-1 text-[14px]">
                {item.name}
                {item.color && <span className="ml-2 inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: item.color }} />}
              </span>
              <span className="text-[14px]">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-3 border-t border-line pt-4 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-body">Subtotal</dt>
            <dd>{formatPrice(cartSubtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-body">Delivery</dt>
            <dd>{fee === 0 ? "Free" : formatPrice(fee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[17px] font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(cartSubtotal + fee)}</dd>
          </div>
        </dl>

        {state?.error && (
          <p role="alert" className="mt-5 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-dark mt-6 w-full !py-4">
          {pending ? "Placing order…" : "Place order"}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted">Final prices are confirmed when your order is placed.</p>
      </aside>
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
