"use client";

type LoaderProps = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderProps) {
  const q = quality || 75;

  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }

  // Supabase Storage public URLs can be resized through the render endpoint.
  if (src.includes(".supabase.co/storage/v1/object/public/")) {
    const url = new URL(src.replace("/object/public/", "/render/image/public/"));
    url.searchParams.set("width", String(width));
    url.searchParams.set("quality", String(q));
    // Without this, Supabase keeps the original height and crops the sides.
    url.searchParams.set("resize", "contain");
    return url.toString();
  }

  // Local files in /public are served as-is.
  return src.includes("?") ? src : `${src}?w=${width}`;
}
