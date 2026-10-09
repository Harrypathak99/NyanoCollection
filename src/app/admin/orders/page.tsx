import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card, td, th } from "../ui";
import { ORDER_STATUSES, StatusBadge } from "@/components/order-status";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata = { title: "Orders" };

export default function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}

async function Orders({ searchParams }: { searchParams: PageProps<"/admin/orders">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && ORDER_STATUSES.includes(sp.status as never) ? sp.status : null;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 60) : "";

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, phone, city, status, total, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (q) {
    const safe = q.replace(/[%_,()]/g, " ");
    query = query.or(`order_number.ilike.%${safe}%,customer_name.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  const tabs = [{ label: "All", value: null }, ...ORDER_STATUSES.map((s) => ({ label: s, value: s }))];

  return (
    <>
      <AdminTitle title="Orders" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <li key={t.label}>
              <Link
                href={t.value ? `/admin/orders?status=${t.value}` : "/admin/orders"}
                className={`rounded-full px-3 py-1.5 text-[13px] capitalize ${
                  status === t.value ? "bg-ink text-white" : "bg-white text-body ring-1 ring-line hover:text-ink"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Order no., name or phone" className="input !w-60 !py-2" />
          <button type="submit" className="btn-dark !px-4 !py-2">
            Search
          </button>
        </form>
      </div>

      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-line bg-[#fbfaf9]">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={th}>Phone</th>
                <th className={th}>City</th>
                <th className={th}>Placed</th>
                <th className={th}>Status</th>
                <th className={`${th} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[#fbfaf9]">
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium underline hover:text-accent">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className={td}>{o.customer_name}</td>
                  <td className={td}>
                    <a href={`tel:${o.phone}`} className="hover:text-accent">
                      {o.phone}
                    </a>
                  </td>
                  <td className={`${td} text-body`}>{o.city}</td>
                  <td className={`${td} text-body`}>{formatDateTime(o.created_at)}</td>
                  <td className={td}>
                    <StatusBadge status={o.status} />
                  </td>
                  <td className={`${td} text-right`}>{formatPrice(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className={`${td} py-12 text-center text-muted`}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
