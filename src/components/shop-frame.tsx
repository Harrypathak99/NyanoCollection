import { AnnouncementBar } from "@/components/announcement-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { buildNav } from "@/lib/site";

/** Storefront chrome: announcement bar, header, footer and cart drawer. */
export function ShopFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

async function SiteHeader() {
  "use cache";
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);
  return <Header nav={buildNav(categories, featured)} />;
}
