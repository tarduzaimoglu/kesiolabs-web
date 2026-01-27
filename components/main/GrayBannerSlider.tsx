"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getMediaUrl } from "@/lib/strapi-main";

type GrayBanner = {
  id: number;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  image?: any | null;
};

export default function GrayBannerSlider({ banners }: { banners: GrayBanner[] }) {
  const items = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setActive((i) => (i + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;

  const b = items[Math.min(active, items.length - 1)];
  const img = getMediaUrl(b?.image?.url);

  return (
    <section className="w-full bg-white py-10 md:py-14">
  <div className="w-full px-0">
        {/* Banner (background image + centered text) */}
        <div
          className="
            relative overflow-hidden border border-slate-200 bg-slate-50
            rounded-tl-[98px] md:rounded-tl-[196px]
          "
        >
          {/* background image */}
          {img ? (
            <div className="absolute inset-0">
              <Image
                src={img}
                alt={b?.image?.alternativeText || b.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* readability overlay (çok hafif) */}
              <div className="absolute inset-0 bg-black/25" />
            </div>
          ) : null}

          {/* content centered */}
          <div className="relative z-10 h-[520px] md:h-[680px] flex items-center justify-center text-center px-6">
            <div className="max-w-2xl">
              <h3 className="text-xl md:text-3xl font-semibold text-white">
                {b.title}
              </h3>

              {b.subtitle ? (
                <p className="mt-3 text-sm md:text-base text-white/85 leading-relaxed whitespace-pre-line">
                  {b.subtitle}
                </p>
              ) : null}

              {b.buttonText && b.buttonLink ? (
                <div className="mt-6 flex justify-center">
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
        </div>

        {/* dots */}
        {items.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === active ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
