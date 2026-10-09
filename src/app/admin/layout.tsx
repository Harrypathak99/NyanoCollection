import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "./admin-nav";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: { default: "Admin", template: "%s | Admin" }, robots: { index: false } };

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f5] lg:flex-row">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="font-sans text-[15px] font-medium uppercase tracking-[0.14em]">
            {SITE.name}
          </Link>
          <span className="text-[11px] uppercase tracking-wider text-muted lg:mt-1 lg:block">Admin panel</span>
        </div>
        <AdminNav />
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
