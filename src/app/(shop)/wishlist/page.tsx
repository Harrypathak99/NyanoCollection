import type { Metadata } from "next";
import { WishlistView } from "./wishlist-view";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <>
      <PageHeader title="Wishlist" crumbs={[{ label: "Wishlist" }]} />
      <WishlistView />
    </>
  );
}
