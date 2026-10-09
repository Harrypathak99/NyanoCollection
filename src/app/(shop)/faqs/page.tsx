import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { DELIVERY_FEE, FREE_SHIPPING_OVER, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "FAQs" };

const FAQS = [
  {
    q: "How do I pay for my order?",
    a: "We only accept cash on delivery. Pay the delivery person in cash when your candles arrive.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 2–5 working days. We'll call you to confirm your order before it ships.",
  },
  {
    q: "How much is delivery?",
    a: `Delivery is free on orders over ${formatPrice(FREE_SHIPPING_OVER)}. Smaller orders have a ${formatPrice(DELIVERY_FEE)} delivery fee.`,
  },
  {
    q: "How can I track my order?",
    a: "Use the Track order page with your order number and phone number. If you have an account, your orders also appear under My account.",
  },
  {
    q: "What are your candles made of?",
    a: "Natural soy wax, lead-free cotton wicks and phthalate-free fragrance oils. All our candles are vegan.",
  },
  {
    q: "How long do the candles burn?",
    a: "Each product page lists its burn time. Most of our jar candles burn for 45–50 hours.",
  },
  {
    q: "Can I return a candle?",
    a: "If your candle arrives damaged, contact us within 3 days with a photo and we'll replace it. See our shipping & returns page for details.",
  },
];

export default function FaqsPage() {
  return (
    <>
      <PageHeader title="Frequently asked questions" crumbs={[{ label: "FAQs" }]} />
      <section className="container-page max-w-3xl py-14 lg:py-20">
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-[18px] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-[22px] leading-none text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pt-3 leading-relaxed text-body">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-center text-body">
          Still have a question?{" "}
          <Link href="/contact" className="text-ink underline hover:text-accent">
            Contact us
          </Link>
          .
        </p>
      </section>
    </>
  );
}
