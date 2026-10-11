export const SITE = {
  name: "Nyano Collection",
  tagline: "Hand-poured candles to brighten your every day",
  email: "hello@nyanocollection.com",
  phone: "+977 980-0000000",
  address: "Kathmandu, Nepal",
  instagram: "nyanoo_collection",
  social: {
    instagram: "https://www.instagram.com/nyanoo_collection",
    tiktok: "https://www.tiktok.com/@nyano_collection",
  },
};

export const ANNOUNCEMENTS = [
  { text: "Free shipping over Rs. 1,000!", href: "/shipping" },
  { text: "Because it can change your mood", href: "/shop" },
  { text: "Bright your every day", href: "/shop?sort=newest" },
];

export type NavLink = { label: string; href: string };
export type NavMenu = { label: string; href: string; links: NavLink[] };

/** Header menus. Category and product links are filled in from the database. */
export function buildNav(
  categories: { name: string; slug: string }[],
  products: { name: string; slug: string }[],
): NavMenu[] {
  return [
    {
      label: "Home",
      href: "/",
      links: [
        { label: "Home", href: "/" },
        { label: "New arrivals", href: "/shop?sort=newest" },
        { label: "Special offer", href: "/#special-offer" },
        { label: "Shop by categories", href: "/#categories" },
        { label: "Instagram gallery", href: "/#gallery" },
      ],
    },
    {
      label: "Shop",
      href: "/shop",
      links: [
        { label: "All products", href: "/shop" },
        ...categories.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
        { label: "On sale", href: "/shop?sale=1" },
        { label: "All categories", href: "/categories" },
      ],
    },
    {
      label: "Products",
      href: "/shop?sort=featured",
      links: [
        ...products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
        { label: "View all products", href: "/shop" },
      ],
    },
    {
      label: "Pages",
      href: "/about",
      links: [
        { label: "About us", href: "/about" },
        { label: "Contact us", href: "/contact" },
        { label: "FAQs", href: "/faqs" },
        { label: "Blog", href: "/blog" },
        { label: "Shipping & returns", href: "/shipping" },
        { label: "Track your order", href: "/track-order" },
      ],
    },
    {
      label: "FoxKit",
      href: "/wishlist",
      links: [
        { label: "Wishlist", href: "/wishlist" },
        { label: "Product compare", href: "/compare" },
        { label: "Cart", href: "/cart" },
        { label: "My account", href: "/account" },
      ],
    },
  ];
}

export const FOOTER_LINKS: { title: string; links: NavLink[] }[] = [
  {
    title: "About",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Infomation",
    links: [
      { label: "My account", href: "/account" },
      { label: "Cart", href: "/cart" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Product Compare", href: "/compare" },
    ],
  },
];
