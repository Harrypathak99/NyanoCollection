"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type Slide = { eyebrow: string; title: [string, string]; cta: string; href: string; image: string; bg: string };

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((slide, i) => (
          <div
            key={slide.title.join(" ")}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 transition-opacity duration-700 ${i === index ? "z-10 opacity-100" : "z-0 opacity-0"}`}
            style={{ backgroundColor: slide.bg }}
          >
            <div className="container-page grid min-h-[520px] items-center md:min-h-[380px] md:grid-cols-[1fr_1.15fr] lg:min-h-[460px]">
              <div className="order-2 pb-16 pt-8 md:order-1 md:py-0">
                <p className="mb-4 text-[13px] font-medium text-ink">{slide.eyebrow}</p>
                <h1 className="mb-7 text-[40px] leading-[1.15] text-ink lg:text-[56px]">
                  {slide.title[0]}
                  <br />
                  {slide.title[1]}
                </h1>
                <Link href={slide.href} tabIndex={i === index ? 0 : -1} className="link-wave">
                  {slide.cta}
                </Link>
              </div>
              <div className="relative order-1 h-[260px] md:order-2 md:h-full md:min-h-[380px] lg:min-h-[460px]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center gap-3">
        {slides.map((slide, i) => (
          <button
            key={slide.title.join(" ")}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="flex h-4 w-4 items-center justify-center"
          >
            <span
              className={`block rounded-full transition-all ${
                i === index ? "h-3 w-3 border border-ink bg-transparent" : "h-1.5 w-1.5 bg-ink"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
