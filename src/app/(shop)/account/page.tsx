import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "./actions";
import { ProfileForm } from "./profile-form";
import { StatusBadge } from "@/components/order-status";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="My account" crumbs={[{ label: "My account" }]} />
      <Suspense fallback={<div className="container-page h-80 animate-pulse py-14" />}>
        <AccountContent />
      </Suspense>
    </>
  );
}

async function AccountContent() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, order_items(quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as unknown as (Pick<Order, "id" | "order_number" | "status" | "total" | "created_at"> & {
    order_items: { quantity: number }[];
  })[];

  return (
    <div className="container-page grid gap-12 py-12 lg:grid-cols-[1fr_340px]">
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-[24px]">Hello, {user.full_name || user.email}</h2>
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link href="/admin" className="btn-dark !px-4 !py-2 !text-[11px]">
                Admin panel
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="text-[13px] text-muted underline hover:text-accent">
                Log out
              </button>
            </form>
          </div>
        </div>

        <h3 className="mb-4 font-sans text-[15px] font-medium">Order history</h3>
        {orders.length === 0 ? (
          <p className="bg-sand p-6 text-body">
            You haven&apos;t placed any orders yet.{" "}
            <Link href="/shop" className="text-ink underline hover:text-accent">
              Start shopping
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead className="border-b border-line text-[12px] uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-3 font-normal">Order</th>
                  <th className="py-3 font-normal">Date</th>
                  <th className="py-3 font-normal">Status</th>
                  <th className="py-3 font-normal">Items</th>
                  <th className="py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3">
                      <Link href={`/account/orders/${o.id}`} className="font-medium underline hover:text-accent">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="py-3 text-body">{formatDate(o.created_at)}</td>
                    <td className="py-3">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 text-body">{o.order_items.reduce((n, i) => n + i.quantity, 0)}</td>
                    <td className="py-3 text-right">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <aside className="h-fit bg-sand p-7">
        <h3 className="mb-5 text-[20px]">Your details</h3>
        <p className="mb-4 text-[13px] text-body">{user.email}</p>
        <ProfileForm user={user} />
      </aside>
    </div>
  );
}
