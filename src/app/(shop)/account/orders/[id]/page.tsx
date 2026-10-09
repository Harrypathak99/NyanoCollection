import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderDetail } from "@/components/order-detail";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Order details" };

export default function AccountOrderPage({ params }: PageProps<"/account/orders/[id]">) {
  return (
    <>
      <PageHeader title="Order details" crumbs={[{ label: "My account", href: "/account" }, { label: "Order" }]} />
      <Suspense fallback={<div className="container-page h-80 animate-pulse py-14" />}>
        <AccountOrder params={params} />
      </Suspense>
    </>
  );
}

async function AccountOrder({ params }: { params: PageProps<"/account/orders/[id]">["params"] }) {
  const { id } = await params;
  const user = await requireUser(`/account/orders/${id}`);
  const supabase = await createClient();
  // RLS only returns the order if it belongs to this user (or the user is an admin).
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (!data) notFound();

  return (
    <div className="container-page max-w-3xl py-12">
      <OrderDetail order={data as Order} />
    </div>
  );
}
