import { Suspense } from "react";
import { AdminSkeleton, AdminTitle, Card, td, th } from "../ui";
import { requireAdmin } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Customers" };

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Customers />
    </Suspense>
  );
}

async function Customers() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, phone, city, role, created_at").order("created_at", { ascending: false }),
    supabase.from("orders").select("user_id, phone, customer_name, total, status"),
  ]);

  const byUser = new Map<string, { count: number; spent: number }>();
  for (const o of orders ?? []) {
    if (!o.user_id) continue;
    const s = byUser.get(o.user_id) ?? { count: 0, spent: 0 };
    s.count++;
    if (o.status !== "cancelled") s.spent += Number(o.total);
    byUser.set(o.user_id, s);
  }

  // Guests are grouped by phone number.
  const guests = new Map<string, { name: string; count: number; spent: number }>();
  for (const o of orders ?? []) {
    if (o.user_id) continue;
    const g = guests.get(o.phone) ?? { name: o.customer_name, count: 0, spent: 0 };
    g.count++;
    if (o.status !== "cancelled") g.spent += Number(o.total);
    guests.set(o.phone, g);
  }

  return (
    <>
      <AdminTitle title="Customers" />
      <h2 className="mb-3 text-[20px]">Registered customers</h2>
      <Card className="mb-10 !p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="border-b border-line bg-[#fbfaf9]">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Phone</th>
                <th className={th}>City</th>
                <th className={th}>Joined</th>
                <th className={th}>Orders</th>
                <th className={`${th} text-right`}>Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(profiles ?? []).map((p) => {
                const s = byUser.get(p.id);
                return (
                  <tr key={p.id}>
                    <td className={td}>
                      {p.full_name || "—"}
                      {p.role === "admin" && <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[10px] text-white">Admin</span>}
                    </td>
                    <td className={`${td} text-body`}>{p.email ?? "—"}</td>
                    <td className={`${td} text-body`}>{p.phone ?? "—"}</td>
                    <td className={`${td} text-body`}>{p.city ?? "—"}</td>
                    <td className={`${td} text-body`}>{formatDate(p.created_at)}</td>
                    <td className={td}>{s?.count ?? 0}</td>
                    <td className={`${td} text-right`}>{formatPrice(s?.spent ?? 0)}</td>
                  </tr>
                );
              })}
              {(profiles ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className={`${td} py-10 text-center text-muted`}>
                    No registered customers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <h2 className="mb-3 text-[20px]">Guest customers</h2>
      <Card className="!p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead className="border-b border-line bg-[#fbfaf9]">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Phone</th>
                <th className={th}>Orders</th>
                <th className={`${th} text-right`}>Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {[...guests.entries()].map(([phone, g]) => (
                <tr key={phone}>
                  <td className={td}>{g.name}</td>
                  <td className={td}>
                    <a href={`tel:${phone}`} className="hover:text-accent">
                      {phone}
                    </a>
                  </td>
                  <td className={td}>{g.count}</td>
                  <td className={`${td} text-right`}>{formatPrice(g.spent)}</td>
                </tr>
              ))}
              {guests.size === 0 && (
                <tr>
                  <td colSpan={4} className={`${td} py-10 text-center text-muted`}>
                    No guest orders yet.
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
