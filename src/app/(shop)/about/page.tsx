import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader, SectionTitle } from "@/components/ui";

export const metadata: Metadata = { title: "About us" };

const VALUES = [
  { title: "Hand-poured", text: "Every candle is poured by hand in small batches, so each one gets our full attention." },
  { title: "Clean ingredients", text: "Natural soy wax, lead-free cotton wicks and phthalate-free fragrance oils." },
  { title: "Made to last", text: "Burn times of up to 50 hours, in vessels you'll want to reuse long after." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About us" crumbs={[{ label: "About us" }]} />
      <section id="story" className="container-page grid items-center gap-10 py-16 md:grid-cols-2 lg:gap-20 lg:py-24">
        <div className="relative aspect-[4/5] bg-card">
          <Image src="https://images.unsplash.com/photo-1631980284299-812d79c52b54" alt="Candles on a wooden table" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">Our story</p>
          <h2 className="mb-6 text-[30px] leading-tight lg:text-[38px]">Be like a candle, give your warmth and light to others</h2>
          <div className="prose-candle">
            <p>
              Nyano Collection began at a kitchen table with a pot of soy wax and a love of slow evenings. Today we still pour every candle
              by hand, choosing fragrances that make a home feel calm, warm and a little brighter.
            </p>
            <p>
              We believe beautiful things should be kind to the people who use them, so we keep our ingredients simple and our
              vessels reusable.
            </p>
          </div>
          <Link href="/shop" className="link-wave mt-4">
            Shop the collection
          </Link>
        </div>
      </section>
      <section className="bg-sand py-16 lg:py-20">
        <div className="container-page">
          <SectionTitle>What we care about</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white p-8 text-center">
                <h3 className="mb-3 text-[20px]">{v.title}</h3>
                <p className="text-[14px] leading-relaxed text-body">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
