import type { Metadata } from "next";
import { CartView } from "./cart-view";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Shopping cart" crumbs={[{ label: "Cart" }]} />
      <CartView />
    </>
  );
}
