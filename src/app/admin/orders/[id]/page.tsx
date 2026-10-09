import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminSkeleton, Card } from "../../ui";
import { StatusForm } from "./status-form";
import { OrderDetail } from "@/components/order-detail";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata = { title: "Order" };

export default function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminOrder params={params} />
    </Suspense>
  );
}

async function AdminOrder({ params }: { params: PageProps<"/admin/orders/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const order = data as Order;

  return (
    <>
      <Link href="/admin/orders" className="mb-4 inline-block text-[13px] text-muted hover:text-accent">
        ← All orders
      </Link>
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card>
          <OrderDetail order={order} admin />
        </Card>
        <Card className="h-fit">
          <h2 className="mb-4 text-[20px]">Update status</h2>
          <StatusForm orderId={order.id} status={order.status} />
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            Call the customer to confirm before shipping. Cancelling an order puts its items back in stock.
          </p>
        </Card>
      </div>
    </>
  );
}
