"use client";

import { useActionState } from "react";
import { trackOrder } from "./actions";
import { StatusSteps } from "@/components/order-status";
import { formatDate, formatPrice } from "@/lib/format";

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrder, null);
  const order = state?.order;

  return (
    <div className="container-page max-w-2xl py-12">
      <form action={action} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="order" className="label">
            Order number
          </label>
          <input id="order" name="order" required defaultValue={state?.fields?.order} placeholder="NC261009-XXXXX" className="input uppercase" />
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Phone number
          </label>
          <input id="phone" name="phone" type="tel" required defaultValue={state?.fields?.phone} className="input" />
        </div>
        <button type="submit" disabled={pending} className="btn-dark !py-3">
          {pending ? "Checking…" : "Track"}
        </button>
      </form>

      {state?.error && (
        <p role="alert" className="mt-6 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {state.error}
        </p>
      )}

      {order && (
        <section className="mt-10 border border-line p-6">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-[22px]">Order {order.order_number}</h2>
            <span className="text-[13px] text-muted">Placed {formatDate(order.created_at)}</span>
          </div>
          <StatusSteps status={order.status} />
          <ul className="mt-8 divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between py-3 text-[14px]">
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 border-t border-line pt-3 text-[14px]">
            <p className="flex justify-between text-body">
              <span>Delivery</span>
              <span>{Number(order.delivery_fee) === 0 ? "Free" : formatPrice(order.delivery_fee)}</span>
            </p>
            <p className="flex justify-between font-medium">
              <span>Total (cash on delivery)</span>
              <span>{formatPrice(order.total)}</span>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
