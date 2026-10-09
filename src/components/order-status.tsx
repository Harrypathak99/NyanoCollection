import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-green-50 text-green-700 ring-green-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1 ${STYLES[status]}`}>
      {status}
    </span>
  );
}

export function StatusSteps({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return <p className="text-red-700">This order was cancelled.</p>;
  const steps: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];
  const current = steps.indexOf(status);
  const labels = { pending: "Order placed", confirmed: "Confirmed", shipped: "On the way", delivered: "Delivered" } as const;

  return (
    <ol className="grid grid-cols-4 gap-2">
      {steps.map((s, i) => (
        <li key={s} className="text-center">
          <span className={`mx-auto mb-2 block h-1.5 rounded-full ${i <= current ? "bg-accent" : "bg-line"}`} />
          <span className={`text-[12px] ${i <= current ? "text-ink" : "text-muted"}`}>{labels[s as keyof typeof labels]}</span>
        </li>
      ))}
    </ol>
  );
}
