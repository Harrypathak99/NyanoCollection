import { InstagramIcon, TikTokIcon } from "@/components/icons";
import { SITE } from "@/lib/site";

const LINKS = [
  { label: "Instagram", href: SITE.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: SITE.social.tiktok, Icon: TikTokIcon },
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
