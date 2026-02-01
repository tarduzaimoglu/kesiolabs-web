"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/strapi-main";

type GrayBanner = {
  id: number;
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  image?: any | null;
};

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return ((i % len) + len) % len;
}

export default function GrayBannerSlider({ banners }: { banners: GrayBanner[] }) {
  const items = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);
  const [active, setActive] = useState(0);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const widthRef = useRef(1);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;
    if (isDragging) return;

    const t = setInterval(() => {
      setActive((i) => clampIndex(i + 1, items.length));
    }, 8000);

    return () => clearInterval(t);
  }, [items.length, isDragging]);

  useEffect(() => {
    if (!items.length) return;
    setActive((i) => clampIndex(i, items.length));
  }, [items.length]);

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

  const settle = (clientX: number) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    const dx = clientX - startXRef.current;
    const w = widthRef.current || 1;
    const minSwipe = Math.max(60, w * 0.15);

    if (dx <= -minSwipe) goTo(active + 1);
    else if (dx >= minSwipe) goTo(active - 1);

    setDragOffset(0);
  };

  // Pointer
  const onPointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;

    try {
      viewportRef.current?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    setDragOffset(e.clientX - startXRef.current);
  };

  const onPointerUp = (e: React.PointerEvent) => settle(e.clientX);
  const onPointerCancel = (e: React.PointerEvent) => settle(e.clientX);

  // Touch
  const onTouchStart = (e: React.TouchEvent) => {
    if (items.length <= 1) return;
    const x = e.touches[0]?.clientX ?? 0;

    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = x;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const x = e.touches[0]?.clientX ?? 0;
    const dx = x - startXRef.current;

    if (Math.abs(dx) > 6) e.preventDefault();
    setDragOffset(dx);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const x = e.changedTouches[0]?.clientX ?? startXRef.current;
    settle(x);
  };

  const onTouchCancel = (e: React.TouchEvent) => {
    const x = e.changedTouches[0]?.clientX ?? startXRef.current;
    settle(x);
  };

  const translateX = -(active * 100);

  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="w-full px-0">
        <div
          ref={viewportRef}
          className={[
            "relative overflow-hidden border border-slate-200 bg-slate-50",
            "rounded-tl-[98px] md:rounded-tl-[196px]",
            "select-none",
            items.length > 1 ? "cursor-grab active:cursor-grabbing" : "",
          ].join(" ")}
          style={{ touchAction: "pan-y" }}
          // Pointer
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          // Touch
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchCancel}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(calc(${translateX}% + ${dragOffset}px))`,
              transition: isDragging ? "none" : "transform 450ms ease",
              willChange: "transform",
            }}
          >
            {items.map((b) => {
              const img = getMediaUrl(b?.image?.url);
              return (
                <div
                  key={b.id}
                  className="relative h-[520px] md:h-[680px] w-full flex-shrink-0"
                >
                  {img ? (
                    <div className="absolute inset-0">
                      <Image
                        src={img}
                        alt={b?.image?.alternativeText || b.title}
                        fill
                        className="object-cover"
                        unoptimized
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/25" />
                    </div>
                  ) : null}

                  <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
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
                            onClick={(e) => {
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
        </div>

        {items.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                onClick={() => goTo(i)}
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
