"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/strapi-main";
import { ArrowRight } from "lucide-react";

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

  const onPointerDown = (e: React.PointerEvent) => {
    if (items.length <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.clientX;
    try { viewportRef.current?.setPointerCapture?.(e.pointerId); } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    setDragOffset(e.clientX - startXRef.current);
  };

  const onPointerUp = (e: React.PointerEvent) => settle(e.clientX);
  const onPointerCancel = (e: React.PointerEvent) => settle(e.clientX);

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
    <div className="w-full">
      <div
        ref={viewportRef}
        className={`relative overflow-hidden w-full select-none rounded-b-[60px] md:rounded-b-[120px] bg-black/40
          ${items.length > 1 ? "cursor-grab active:cursor-grabbing" : ""}
        `}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(calc(${translateX}% + ${dragOffset}px))`,
            transition: isDragging ? "none" : "transform 500ms cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
          }}
        >
          {items.map((b) => {
            const img = getMediaUrl(b?.image?.url);
            return (
              <div key={b.id} className="relative h-[480px] md:h-[600px] w-full flex-shrink-0">
                {img ? (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={img}
                      alt={b?.image?.alternativeText || b.title}
                      fill
                      className="object-cover"
                      unoptimized
                      draggable={false}
                      priority
                    />
                    {/* Görsel üzerine düşen şık karanlık maske (Overlay) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/70 to-transparent" />
                    <div className="absolute inset-0 bg-[#0b1120]/30 mix-blend-multiply" />
                  </div>
                ) : null}

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                      {b.title}
                    </h3>

                    {b.subtitle ? (
                      <p className="mt-4 md:mt-6 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                        {b.subtitle}
                      </p>
                    ) : null}

                    {b.buttonText && b.buttonLink ? (
                      <div className="mt-8 md:mt-10 flex justify-center">
                        <Link
                          href={b.buttonLink}
                          className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white border border-white/20 backdrop-blur-md shadow-lg shadow-black/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1"
                          onClick={(e) => {
                            if (isDraggingRef.current) e.preventDefault();
                          }}
                        >
                          {b.buttonText}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nokta (Dot) İndikatörleri */}
        {items.length > 1 ? (
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-3 z-20">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Banner ${i + 1}`}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === active 
                    ? "w-8 h-2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
