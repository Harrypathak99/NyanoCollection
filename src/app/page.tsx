import Image from "next/image";
import Link from "next/link";
import { AddToCartPill } from "@/components/add-to-cart";
import { Countdown } from "@/components/countdown";
import { HeroSlider, type Slide } from "@/components/hero-slider";
import { PlayIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { ShopFrame } from "@/components/shop-frame";
import { SocialLinks } from "@/components/social-links";
import { SectionTitle, Sprig } from "@/components/ui";
import { getCategories, getFeaturedProducts, getSpecialProduct } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

const U = "https://images.unsplash.com/";

const SLIDES: Slide[] = [
  {
    eyebrow: "New arrivals",
    title: ["Choose well", "Be well"],
    cta: "Check our item",
    href: "/shop?sort=newest",
    image: `${U}photo-1643122966676-29e8597257f7`,
    bg: "#d6dfd7",
  },
  {
    eyebrow: "Hand-poured soy wax",
    title: ["Light up", "your home"],
    cta: "Shop scented",
    href: "/category/scented-candle",
    image: `${U}photo-1602607203588-d6d0eda790e3`,
    bg: "#efe6df",
  },
  {
    eyebrow: "Gift sets",
    title: ["Made for", "sharing"],
    cta: "Shop candle sets",
    href: "/category/candle-set",
    image: `${U}photo-1693401214469-adf453b5592f`,
    bg: "#f3ece4",
  },
];

const GALLERY = [
  `${U}photo-1646389097588-804e46e08797`,
  `${U}photo-1631980284299-812d79c52b54`,
  `${U}photo-1643122966676-29e8597257f7`,
  `${U}photo-1746905353432-afcafa675c16`,
];

export default function HomePage() {
  return (
    <ShopFrame>
      <HeroSlider slides={SLIDES} />
      <FeaturedProducts />
      <ShopByCategories />
      <SpecialOffer />
      <FragranceBanner />
      <Gallery />
    </ShopFrame>
  );
}

async function FeaturedProducts() {
  "use cache";
  const products = await getFeaturedProducts(8);

  return (
    <section className="container-page pb-16 pt-6 lg:pb-24 lg:pt-8">
      <div className="mb-10 flex items-center justify-end gap-5 lg:mb-14">
        <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-body">Connect with us</span>
        <SocialLinks size={20} />
      </div>
      <SectionTitle>Be like a candle, give your warmth and light to others</SectionTitle>
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 4} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/shop" className="link-wave !text-[11px]">
          View all products
        </Link>
      </div>
    </section>
  );
}

async function ShopByCategories() {
  "use cache";
  const categories = (await getCategories()).slice(0, 3);

  return (
    <section id="categories" className="scroll-mt-4 bg-sand py-14 lg:py-20">
      <div className="container-page mx-auto grid max-w-[1080px] gap-8 lg:grid-cols-[1fr_3fr] lg:items-start">
        <div className="lg:pt-2">
          <h2 className="mb-4 text-[28px] leading-tight lg:text-[32px]">
            Shop by
            <br className="hidden lg:block" /> categories
          </h2>
          <p className="max-w-[220px] text-[12px] leading-relaxed text-body">
            All our candles are made from the finest wax and lead-free wicks to ensure a long, clean burn.
          </p>
          <Link href="/categories" className="link-wave mt-5 !text-[11px]">
            All categories
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="group flex flex-col items-center bg-white px-6 pb-7 pt-6 text-center transition-shadow hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
            >
              <h3 className="mb-5 text-[15px] text-ink group-hover:text-accent">{c.name}</h3>
              <span className="relative block aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-card">
                {c.image_url && (
                  <Image
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
              </span>
              <span className="mt-5 text-[12px] text-body">{c.product_count} items</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

async function SpecialOffer() {
  "use cache";
  const product = await getSpecialProduct();
  if (!product) return null;

  const [small, large] = product.images;
  const saving = product.compare_at_price ? product.compare_at_price - product.price : 0;
  const href = `/products/${product.slug}`;

  return (
    <section id="special-offer" className="container-page scroll-mt-4 py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1000px] items-center gap-10 md:grid-cols-2 md:gap-12">
        <div className="grid grid-cols-[0.85fr_1fr] items-center gap-4">
          <Link href={href} className="relative block aspect-[4/5] bg-card">
            {small && <Image src={small.url} alt={product.name} fill sizes="(min-width: 768px) 22vw, 45vw" className="object-cover" />}
            {saving > 0 && (
              <span className="absolute -right-3 -top-5 flex h-[58px] w-[58px] flex-col items-center justify-center rounded-full bg-accent text-center text-white lg:-right-4 lg:-top-6 lg:h-[66px] lg:w-[66px]">
                <span className="text-[9px] leading-none">Save</span>
                <span className="mt-0.5 text-[12px] font-semibold leading-none">{formatPrice(saving)}</span>
              </span>
            )}
          </Link>
          <Link href={href} className="relative block aspect-[3/4] bg-card md:-mt-0">
            {(large ?? small) && (
              <Image src={(large ?? small).url} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
            )}
          </Link>
        </div>

        <div className="text-center">
          <span className="inline-block rounded-full bg-peach px-3 py-1 text-[10px] font-medium text-accent">Special Price</span>
          <h2 className="mb-4 mt-4 text-[26px] lg:text-[30px]">
            <Link href={href} className="hover:text-accent">
              {product.name}
            </Link>
          </h2>
          <p className="mx-auto mb-7 max-w-xs text-[12px] font-medium leading-relaxed text-body">{product.short_description}</p>
          {product.special_ends_at && (
            <div className="mb-8">
              <Countdown endsAt={product.special_ends_at} />
            </div>
          )}
          <AddToCartPill product={product} />
        </div>
      </div>
    </section>
  );
}

function FragranceBanner() {
  return (
    <section className="grid md:grid-cols-2">
      <div className="flex items-center justify-center bg-blush px-6 py-16 text-center lg:py-24">
        <div className="max-w-sm">
          <Sprig className="mx-auto mb-4 h-14 w-16" />
          <h2 className="mb-5 text-[26px] leading-snug lg:text-[30px]">Enjoy the fragrance of a scented candle</h2>
          <p className="mx-auto mb-8 max-w-[300px] text-[12px] font-medium leading-relaxed text-body">
            Made using clean, non-toxic ingredients, our products are designed for everyone.
          </p>
          <Link href="/category/scented-candle" className="link-wave !text-[11px]">
            Discover now
          </Link>
        </div>
      </div>
      <Link href="/blog/why-we-use-soy-wax" className="group relative block min-h-[320px] overflow-hidden" aria-label="Read our story">
        <Image
          src={`${U}photo-1515127680483-04e9143627ac`}
          alt="Lit scented candles"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow transition-transform group-hover:scale-110">
          <PlayIcon size={16} />
        </span>
      </Link>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="container-page scroll-mt-4 py-16 lg:py-24">
      <SectionTitle
        sub={
          <>
            Follow us on Instagram{" "}
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" className="font-semibold text-ink hover:text-accent">
              @{SITE.instagram}
            </a>{" "}
            and make sure to tag us for a chance to be featured.
          </>
        }
      >
        Give us your best shot!
      </SectionTitle>
      <div className="mx-auto grid max-w-[1000px] grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {GALLERY.map((src, i) => (
          <a
            key={src}
            href={SITE.social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label={`Instagram photo ${i + 1}`}
            className="group relative block aspect-square overflow-hidden bg-card"
          >
            <Image src={src} alt="" fill sizes="(min-width: 1024px) 250px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
          </a>
        ))}
      </div>
    </section>
  );
}
