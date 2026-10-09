"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <ul className="flex gap-3 sm:flex-col">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className={`relative block h-24 w-20 overflow-hidden bg-card ring-1 transition ${
                  i === active ? "ring-ink" : "ring-transparent hover:ring-line"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-card">
        {current && (
          <Image
            key={current.url}
            src={current.url}
            alt={current.alt ?? name}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
