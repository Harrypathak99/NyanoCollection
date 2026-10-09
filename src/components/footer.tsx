import Link from "next/link";
import { FacebookIcon, InstagramIcon, PinterestIcon, XIcon } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-white">
      <div className="container-page grid gap-10 border-t border-line pt-14 pb-12 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr] lg:border-t-0">
        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 font-sans text-[14px] font-medium text-ink">{group.title}</h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[12px] text-body transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="mb-3 font-serif text-[22px] text-ink">Don&apos;t miss a thing</h3>
          <p className="mb-5 max-w-sm text-[12px] leading-relaxed text-body">
            Enter your email below to be the first to know about new collections and product launches.
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-page flex flex-col items-center gap-5 pb-10 sm:grid sm:grid-cols-3 sm:items-center">
        <ul className="flex items-center gap-4 text-ink sm:justify-self-start">
          <li>
            <a href={SITE.social.pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest" className="hover:text-accent">
              <PinterestIcon />
            </a>
          </li>
          <li>
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-accent">
              <FacebookIcon />
            </a>
          </li>
          <li>
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-accent">
              <InstagramIcon />
            </a>
          </li>
          <li>
            <a href={SITE.social.x} target="_blank" rel="noreferrer" aria-label="X" className="hover:text-accent">
              <XIcon />
            </a>
          </li>
        </ul>

        <Link href="/" className="whitespace-nowrap font-sans text-[18px] font-medium uppercase tracking-[0.16em] text-ink sm:justify-self-center">
          {SITE.name}
        </Link>

        <Link
          href="/shipping"
          className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-body hover:text-accent sm:justify-self-end"
        >
          <span className="rounded-sm border border-line px-2 py-1 text-ink">Cash on delivery</span>
        </Link>
      </div>
    </footer>
  );
}
