"use client";

import { useActionState } from "react";
import { setOrderStatus } from "../../actions";
import { ORDER_STATUSES } from "@/components/order-status";
import type { OrderStatus } from "@/lib/types";

export function StatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [state, action, pending] = useActionState(setOrderStatus, null);

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="orderId" value={orderId} />
      <label htmlFor="status" className="label">
        Status
      </label>
      <select id="status" name="status" defaultValue={status} className="input capitalize">
        {ORDER_STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>
      <button type="submit" disabled={pending} className="btn-dark w-full">
        {pending ? "Saving…" : "Save status"}
      </button>
      {state && <p className={`text-[13px] ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.message}</p>}
    </form>
  );
}
