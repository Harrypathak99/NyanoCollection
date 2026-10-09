import Link from "next/link";
import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card, td, th } from "./ui";
import { StatusBadge } from "@/components/order-status";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata = { title: "Dashboard" };

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: orders }, { data: lowStock }, { count: productCount }, { count: customerCount }] = await Promise.all([
    supabase.from("orders").select("id, order_number, customer_name, status, total, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, name, stock").lt("stock", 6).order("stock"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const all = (orders ?? []) as Order[];
  const count = (s: string) => all.filter((o) => o.status === s).length;
  const revenue = all.filter((o) => o.status === "delivered").reduce((n, o) => n + Number(o.total), 0);
  const pipeline = all.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status)).reduce((n, o) => n + Number(o.total), 0);

  const stats = [
    { label: "New orders to confirm", value: count("pending"), href: "/admin/orders?status=pending", highlight: count("pending") > 0 },
    { label: "Confirmed / shipping", value: count("confirmed") + count("shipped"), href: "/admin/orders?status=confirmed" },
    { label: "Cash to collect", value: formatPrice(pipeline), href: "/admin/orders" },
    { label: "Delivered revenue", value: formatPrice(revenue), href: "/admin/orders?status=delivered" },
    { label: "Products", value: productCount ?? 0, href: "/admin/products" },
    { label: "Customers", value: customerCount ?? 0, href: "/admin/customers" },
  ];

  return (
    <>
      <AdminTitle title="Dashboard" />
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`rounded-md border bg-white p-5 hover:border-ink ${s.highlight ? "border-accent" : "border-line"}`}>
            <p className="text-[12px] text-muted">{s.label}</p>
            <p className={`mt-2 text-[24px] font-medium ${s.highlight ? "text-accent" : ""}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="!p-0">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[20px]">Recent orders</h2>
            <Link href="/admin/orders" className="text-[13px] underline hover:text-accent">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="border-y border-line bg-[#fbfaf9]">
                <tr>
                  <th className={th}>Order</th>
                  <th className={th}>Customer</th>
                  <th className={th}>Date</th>
                  <th className={th}>Status</th>
                  <th className={`${th} text-right`}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {all.slice(0, 8).map((o) => (
                  <tr key={o.id} className="hover:bg-[#fbfaf9]">
                    <td className={td}>
                      <Link href={`/admin/orders/${o.id}`} className="font-medium underline hover:text-accent">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className={td}>{o.customer_name}</td>
                    <td className={`${td} text-body`}>{formatDate(o.created_at)}</td>
                    <td className={td}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className={`${td} text-right`}>{formatPrice(o.total)}</td>
                  </tr>
                ))}
                {all.length === 0 && (
                  <tr>
                    <td colSpan={5} className={`${td} py-10 text-center text-muted`}>
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-[20px]">Low stock</h2>
          {(lowStock ?? []).length === 0 ? (
            <p className="text-[14px] text-muted">All products have 6 or more in stock.</p>
          ) : (
            <ul className="divide-y divide-line">
              {(lowStock ?? []).map((p) => (
                <li key={p.id} className="flex justify-between py-2 text-[14px]">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-accent">
                    {p.name}
                  </Link>
                  <span className={p.stock === 0 ? "text-red-600" : "text-accent"}>{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
