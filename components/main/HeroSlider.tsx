"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

export default function HeroSlider({ banners }: { banners: Banner[] }) {
  const items = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);
  const [active, setActive] = useState(0);

  // Drag state (refs to avoid rerender)
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const widthRef = useRef(1);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Autoplay
  useEffect(() => {
    if (items.length <= 1) return;
    if (isDragging) return;

    const t = setInterval(() => {
      setActive((i) => clampIndex(i + 1, items.length));
    }, 6500);

    return () => clearInterval(t);
  }, [items.length, isDragging]);

  // Keep active in range
  useEffect(() => {
    if (!items.length) return;
    setActive((i) => clampIndex(i, items.length));
  }, [items.length]);

  // Measure width
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const update = () => {
      widthRef.current = el.getBoundingClientRect().width || 1;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  if (!items.length) return null;

  const goTo = (i: number) => setActive(clampIndex(i, items.length));

  const onPointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;

    // Only main button / touch / pen
    if (e.button !== 0 && e.pointerType === "mouse") return;

    const el = viewportRef.current;
    if (!el) return;

    el.setPointerCapture?.(e.pointerId);

    isDraggingRef.current = true;
    setIsDragging(true);

    startXRef.current = e.clientX;
    startOffsetRef.current = dragOffset; // usually 0, but safe
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    setDragOffset(startOffsetRef.current + dx);
  };

  const endDrag = (clientX: number) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    const dx = clientX - startXRef.current;
    const w = widthRef.current || 1;

    // thresholds
    const minSwipe = Math.max(60, w * 0.15);

    if (dx <= -minSwipe) {
      goTo(active + 1);
    } else if (dx >= minSwipe) {
      goTo(active - 1);
    }

    setDragOffset(0);
  };

  const onPointerUp = (e: React.PointerEvent) => endDrag(e.clientX);
  const onPointerCancel = (e: React.PointerEvent) => endDrag(e.clientX);
  const onPointerLeave = (e: React.PointerEvent) => {
    // If user drags out of bounds then releases, we still want to settle
    if (isDraggingRef.current) endDrag(e.clientX);
  };

  const translateX = -(active * 100);

  return (
    <section className="relative w-full">
      <div
        ref={viewportRef}
        className={[
          "relative h-[520px] md:h-[560px] w-full overflow-hidden",
          "touch-pan-y", // allow vertical scroll, we handle horizontal
          items.length > 1 ? "cursor-grab active:cursor-grabbing" : "",
          "select-none",
        ].join(" ")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        aria-roledescription="carousel"
      >
        {/* Track */}
        <div
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(calc(${translateX}% + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 450ms ease",
            willChange: "transform",
          }}
        >
          {items.map((b) => {
            const desktopUrl = getMediaUrl(b?.imageDesktop?.url);
            const mobileUrl = getMediaUrl(b?.imageMobile?.url);

            return (
              <div key={b.id} className="relative h-full w-full flex-shrink-0">
                {/* Desktop img */}
                {!!desktopUrl && (
                  <div className="hidden md:block absolute inset-0">
                    <Image
                      src={desktopUrl}
                      alt={b?.imageDesktop?.alternativeText || b.title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                      draggable={false}
                    />
                  </div>
                )}

                {/* Mobile img */}
                {!!mobileUrl && (
                  <div className="md:hidden absolute inset-0">
                    <Image
                      src={mobileUrl}
                      alt={b?.imageMobile?.alternativeText || b.title}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                      draggable={false}
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
                          onClick={(e) => {
                            // Drag sırasında link yanlışlıkla tıklanmasın
                            if (isDraggingRef.current) e.preventDefault();
                          }}
                        >
                          {b.buttonText}
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        {items.length > 1 ? (
          <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                onClick={() => goTo(i)}
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
