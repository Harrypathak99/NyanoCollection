"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BagIcon, ChevronDown, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { useStore } from "@/components/store-provider";
import { SITE, type NavMenu } from "@/lib/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`whitespace-nowrap font-sans text-[15px] font-medium uppercase tracking-[0.12em] text-ink sm:text-[20px] sm:tracking-[0.18em] lg:text-[22px] ${className}`}
    >
      {SITE.name}
    </Link>
  );
}

export function Header({ nav }: { nav: NavMenu[] }) {
  const { cartCount, wishlist, setCartOpen, ready } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  return (
    <header className="relative z-40 bg-white">
      <div className="container-page">
        <div className="grid h-[68px] grid-cols-[1fr_auto_1fr] items-center lg:h-[76px]">
          <div className="flex items-center">
            <button
              type="button"
              className="-ml-1 p-1 lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon size={22} />
            </button>
            <SearchBox className="hidden w-[190px] lg:block" />
          </div>

          <Logo />

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <Link href="/account" aria-label="My account" className="hidden hover:text-accent sm:block">
              <UserIcon size={17} />
            </Link>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hover:text-accent">
              <HeartIcon size={17} />
              {ready && wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Link>
            <button type="button" aria-label="Open cart" className="relative hover:text-accent" onClick={() => setCartOpen(true)}>
              <BagIcon size={17} />
              {ready && cartCount > 0 && <Badge>{cartCount}</Badge>}
            </button>
          </div>
        </div>

        <nav aria-label="Main" className="hidden justify-center pb-4 lg:flex">
          <ul className="flex items-center gap-12">
            {nav.map((menu) => (
              <li key={menu.label} className="group relative">
                <Suspense fallback={<MenuLink menu={menu} active={false} />}>
                  <ActiveMenuLink menu={menu} />
                </Suspense>
                <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <ul className="max-h-[70vh] overflow-auto bg-white py-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                    {menu.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link
                          href={link.href}
                          className="block px-5 py-1.5 text-[13px] text-body transition-colors hover:translate-x-1 hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <MobileMenu nav={nav} open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function isActive(pathname: string, href: string) {
  const path = href.split("?")[0];
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

// The current path is only known at request time, so highlighting sits behind Suspense.
function ActiveMenuLink({ menu }: { menu: NavMenu }) {
  return <MenuLink menu={menu} active={isActive(usePathname(), menu.href)} />;
}

function MenuLink({ menu, active }: { menu: NavMenu; active: boolean }) {
  return (
    <Link
      href={menu.href}
      className={`flex items-center gap-1.5 py-2 text-[13px] font-medium hover:text-accent ${active ? "text-accent" : "text-ink"}`}
    >
      {menu.label}
      <ChevronDown className="transition-transform group-hover:rotate-180" />
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-white">
      {children}
    </span>
  );
}

function MobileMenu({ nav, open, onClose }: { nav: NavMenu[]; open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-white transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="font-sans text-[15px] font-medium uppercase tracking-[0.14em]">{SITE.name}</span>
          <button type="button" aria-label="Close menu" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="px-5 py-4">
          <SearchBox onNavigate={onClose} />
        </div>
        <nav className="flex-1 overflow-y-auto px-5 pb-8" aria-label="Mobile">
          <ul>
            {nav.map((menu) => (
              <li key={menu.label} className="border-b border-line">
                <div className="flex items-center justify-between">
                  <Link href={menu.href} onClick={onClose} className="flex-1 py-3 text-[15px] font-medium">
                    {menu.label}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Show ${menu.label} links`}
                    aria-expanded={expanded === menu.label}
                    className="p-3"
                    onClick={() => setExpanded(expanded === menu.label ? null : menu.label)}
                  >
                    <ChevronDown className={`transition-transform ${expanded === menu.label ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {expanded === menu.label && (
                  <ul className="pb-3 pl-3">
                    {menu.links.map((link) => (
                      <li key={link.href + link.label}>
                        <Link href={link.href} onClick={onClose} className="block py-1.5 text-[14px] text-body">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="border-b border-line">
              <Link href="/account" onClick={onClose} className="block py-3 text-[15px] font-medium">
                My account
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}
