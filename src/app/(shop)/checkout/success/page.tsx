import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "./clear-cart";
import { Sprig } from "@/components/ui";

export const metadata: Metadata = { title: "Thank you for your order" };

export default function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  return (
    <section className="container-page py-20 text-center">
      <ClearCart />
      <Sprig className="mx-auto mb-4 h-16 w-20" />
      <h1 className="mb-4 text-[34px]">Thank you for your order!</h1>
      <Suspense fallback={<p className="text-body">Your order has been placed.</p>}>
        <OrderNumber searchParams={searchParams} />
      </Suspense>
      <p className="mx-auto mt-4 max-w-md text-body">
        We&apos;ll call you shortly to confirm your order. Please keep cash ready when your candles arrive.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/track-order" className="btn-outline">
          Track order
        </Link>
        <Link href="/shop" className="btn-dark">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}

async function OrderNumber({ searchParams }: { searchParams: PageProps<"/checkout/success">["searchParams"] }) {
  const { order } = await searchParams;
  const number = typeof order === "string" ? order.slice(0, 40) : null;
  if (!number) return <p className="text-body">Your order has been placed.</p>;
  return (
    <p className="text-body">
      Your order number is <strong className="font-semibold text-ink">{number}</strong>. Save it to track your order.
    </p>
  );
}
