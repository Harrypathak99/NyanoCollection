import Image from "next/image";
import { StatusBadge, StatusSteps } from "@/components/order-status";
import { formatDateTime, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export function OrderDetail({ order, admin = false }: { order: Order; admin?: boolean }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[24px]">Order {order.order_number}</h2>
          <p className="text-[13px] text-muted">Placed {formatDateTime(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {!admin && <StatusSteps status={order.status} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="border border-line p-5 text-[14px]">
          <h3 className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-wider text-muted">Customer</h3>
          <p>{order.customer_name}</p>
          <p className="text-body">
            {admin ? (
              <a href={`tel:${order.phone}`} className="underline hover:text-accent">
                {order.phone}
              </a>
            ) : (
              order.phone
            )}
          </p>
          {order.email && <p className="text-body">{order.email}</p>}
        </div>
        <div className="border border-line p-5 text-[14px]">
          <h3 className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-wider text-muted">Delivery address</h3>
          <p>{order.address}</p>
          <p className="text-body">{order.city}</p>
          {order.notes && <p className="mt-2 text-[13px] italic text-body">Note: {order.notes}</p>}
        </div>
      </div>

      <div>
        <ul className="divide-y divide-line border-y border-line">
          {(order.order_items ?? []).map((item, i) => (
            <li key={item.id ?? i} className="flex items-center gap-4 py-4">
              <span className="relative h-16 w-14 shrink-0 bg-card">
                {item.product_image && <Image src={item.product_image} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <span className="flex-1 text-[14px]">
                {item.product_name}
                {item.color && (
                  <span className="ml-2 inline-block h-3 w-3 rounded-full align-middle ring-1 ring-black/10" style={{ background: item.color }} />
                )}
                <span className="block text-[13px] text-muted">
                  {formatPrice(item.unit_price)} × {item.quantity}
                </span>
              </span>
              <span className="text-[14px]">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
        <dl className="ml-auto mt-4 max-w-xs space-y-2 text-[14px]">
          <div className="flex justify-between">
            <dt className="text-body">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-body">Delivery</dt>
            <dd>{Number(order.delivery_fee) === 0 ? "Free" : formatPrice(order.delivery_fee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2 font-medium">
            <dt>Total (cash on delivery)</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
