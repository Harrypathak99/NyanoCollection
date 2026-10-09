import Link from "next/link";
import { ShopFrame } from "@/components/shop-frame";
import { Sprig } from "@/components/ui";

export default function NotFound() {
  return (
    <ShopFrame>
      <section className="container-page py-24 text-center">
        <Sprig className="mx-auto mb-4 h-16 w-20" />
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-accent">404</p>
        <h1 className="mb-4 text-[34px]">This page has burned out</h1>
        <p className="mx-auto mb-8 max-w-md text-body">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-outline">
            Go home
          </Link>
          <Link href="/shop" className="btn-dark">
            Shop candles
          </Link>
        </div>
      </section>
    </ShopFrame>
  );
}
