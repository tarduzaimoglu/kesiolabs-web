"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMediaUrl } from "@/lib/strapi-main";

type Banner = {
  id: number;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  imageDesktop?: any | null;
  imageMobile?: any | null;
  highlightText?: string | null;
  highlightColor?: string | null;
};

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const items = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % items.length), 6500);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;

  const b = items[Math.min(active, items.length - 1)];

  const desktopUrl = getMediaUrl(b?.imageDesktop?.url);
  const mobileUrl = getMediaUrl(b?.imageMobile?.url);

  return (
    <section className="relative w-full">
      <div className="relative h-[520px] md:h-[560px] w-full overflow-hidden">
        {/* Desktop */}
        {!!desktopUrl && (
          <div className="hidden md:block absolute inset-0">
            <Image
              src={desktopUrl}
              alt={b?.imageDesktop?.alternativeText || b.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Mobile */}
        {!!mobileUrl && (
          <div className="md:hidden absolute inset-0">
            <Image
              src={mobileUrl}
              alt={b?.imageMobile?.alternativeText || b.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        {/* Content */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-5 md:px-8 flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
  {b.highlightText ? (
    <span
      className="mr-2"
      style={{ color: b.highlightColor || "#ff7a00" }}
       >
        {b.highlightText}
      </span>
      ) : null}
        {b.title}
            </h1>

            {b.subtitle ? (
              <p className="mt-4 text-white/85 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {b.subtitle}
              </p>
            ) : null}

            {b.buttonText && b.buttonLink ? (
              <div className="mt-6">
                <Link
                  href={b.buttonLink}
                  className="inline-flex items-center rounded-md bg-white/10 hover:bg-white/15 text-white px-4 py-2 text-sm border border-white/20 backdrop-blur"
                >
                  {b.buttonText}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        {/* Dots */}
        {items.length > 1 ? (
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === active ? "bg-white" : "bg-white/35 hover:bg-white/55"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
