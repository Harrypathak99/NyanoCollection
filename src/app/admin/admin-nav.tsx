"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav() {
  return (
    <nav aria-label="Admin" className="overflow-x-auto px-3 pb-3 lg:px-3">
      <ul className="flex gap-1 lg:flex-col">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Suspense fallback={<NavLink href={link.href} label={link.label} active={false} />}>
              <ActiveNavLink href={link.href} label={link.label} />
            </Suspense>
          </li>
        ))}
        <li className="lg:mt-6 lg:border-t lg:border-line lg:pt-4">
          <Link href="/" className="block whitespace-nowrap rounded px-3 py-2 text-[14px] text-body hover:text-accent">
            ← Back to store
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  return <NavLink href={href} label={label} active={active} />;
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block whitespace-nowrap rounded px-3 py-2 text-[14px] ${active ? "bg-ink text-white" : "text-body hover:bg-sand hover:text-ink"}`}
    >
      {label}
    </Link>
  );
}
