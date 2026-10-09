import { ShopFrame } from "@/components/shop-frame";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <ShopFrame>{children}</ShopFrame>;
}
