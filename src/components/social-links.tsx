import { FacebookIcon, InstagramIcon, PinterestIcon, XIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

const LINKS = [
  { label: "Pinterest", href: SITE.social.pinterest, Icon: PinterestIcon },
  { label: "Facebook", href: SITE.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: SITE.social.instagram, Icon: InstagramIcon },
  { label: "X", href: SITE.social.x, Icon: XIcon },
];

export function SocialLinks({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <ul className={`flex items-center gap-5 text-ink ${className}`}>
      {LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="block transition-colors hover:text-accent">
            <Icon size={size} />
          </a>
        </li>
      ))}
    </ul>
  );
}
