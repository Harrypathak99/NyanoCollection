export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: { heading?: string; text: string }[];
};

export const POSTS: BlogPost[] = [
  {
    slug: "how-to-make-your-candle-burn-longer",
    title: "How to make your candle burn longer",
    excerpt: "A few simple habits give you more hours of glow from every candle you light.",
    date: "2026-09-18",
    image: "https://images.unsplash.com/photo-1643122966676-29e8597257f7",
    body: [
      { text: "A well-cared-for candle can burn up to twice as long as one that is lit and forgotten. These small habits make all the difference." },
      { heading: "Let the first burn reach the edges", text: "The first time you light a candle, let it burn until the melted wax reaches the edge of the jar, usually 2–3 hours. This stops tunnelling, where the wick sinks down the middle and wastes the wax around it." },
      { heading: "Trim the wick every time", text: "Trim the wick to about 5mm before each burn. A short wick gives a calm, even flame without black smoke or soot on the glass." },
      { heading: "Avoid drafts", text: "Open windows, fans and air conditioners make the flame flicker and burn unevenly. Keep your candle somewhere still." },
    ],
  },
  {
    slug: "choosing-a-scent-for-every-room",
    title: "Choosing a scent for every room",
    excerpt: "Fresh notes for the kitchen, calm ones for the bedroom: a simple guide to scenting your home.",
    date: "2026-08-30",
    image: "https://images.unsplash.com/photo-1602607203588-d6d0eda790e3",
    body: [
      { text: "Every room has its own mood. Matching a scent to how you use the space makes your home feel considered and calm." },
      { heading: "Living room", text: "Warm, welcoming notes like tonka, vanilla and amber make a living room feel cosy for guests." },
      { heading: "Kitchen", text: "Fresh herbs, citrus and green fig cut through cooking smells without clashing with food." },
      { heading: "Bedroom", text: "Soft florals, lavender and sandalwood help you wind down at the end of the day." },
    ],
  },
  {
    slug: "why-we-use-soy-wax",
    title: "Why we use natural soy wax",
    excerpt: "Clean-burning, vegan and renewable: here is why every Nyano Collection candle is poured with soy wax.",
    date: "2026-07-12",
    image: "https://images.unsplash.com/photo-1631980284299-812d79c52b54",
    body: [
      { text: "Every Nyano Collection candle is hand-poured with natural soy wax and a lead-free cotton wick." },
      { heading: "A cleaner burn", text: "Soy wax burns cooler and cleaner than paraffin, with less soot on your walls and jars." },
      { heading: "Better scent throw", text: "Because it melts at a lower temperature, soy wax releases fragrance gently and evenly across the room." },
      { heading: "Renewable and vegan", text: "Soy wax is made from soybeans, a renewable crop, and contains no animal products." },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug) ?? null;
}
