import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { DELIVERY_FEE, FREE_SHIPPING_OVER, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return (
    <>
      <PageHeader title="Shipping & returns" crumbs={[{ label: "Shipping & returns" }]} />
      <article className="prose-candle container-page max-w-3xl py-14 lg:py-20">
        <h2>Delivery</h2>
        <p>
          Orders are delivered within 2–5 working days. Delivery is free on orders over {formatPrice(FREE_SHIPPING_OVER)}; smaller
          orders have a flat {formatPrice(DELIVERY_FEE)} delivery fee.
        </p>
        <h2>Cash on delivery</h2>
        <p>
          We don&apos;t take online payments. After you place an order, we call you to confirm it, then you pay in cash when it
          arrives.
        </p>
        <h2>Damaged items</h2>
        <p>
          Candles are packed with care, but if something arrives broken, contact us within 3 days with a photo and your order
          number and we&apos;ll send a replacement.
        </p>
        <h2>Returns</h2>
        <p>
          For hygiene reasons we can&apos;t accept returns of burned candles. Unused candles in their original packaging can be
          returned within 7 days of delivery.
        </p>
        <p>
          Questions? <Link href="/contact" className="text-ink underline hover:text-accent">Contact us</Link> or{" "}
          <Link href="/track-order" className="text-ink underline hover:text-accent">track your order</Link>.
        </p>
      </article>
    </>
  );
}
