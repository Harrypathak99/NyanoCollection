import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "./checkout-form";
import { PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <Suspense fallback={<CheckoutForm defaults={{}} signedIn={false} />}>
        <CheckoutWithUser />
      </Suspense>
    </>
  );
}

async function CheckoutWithUser() {
  const user = await getCurrentUser();
  return (
    <CheckoutForm
      signedIn={Boolean(user)}
      defaults={{
        name: user?.full_name ?? "",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        address: user?.address ?? "",
        city: user?.city ?? "",
      }}
    />
  );
}
