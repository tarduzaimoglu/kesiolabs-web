"use client";

import React, { useMemo, useRef, useState } from "react";

type Props = {
  images: string[];
  alt?: string;
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProductImageGallery({ images, alt = "Ürün görseli", className }: Props) {
  const safeImages = useMemo(() => (Array.isArray(images) ? images.filter(Boolean) : []), [images]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isHover, setIsHover] = useState(false);
  const [lens, setLens] = useState({ x: 0.5, y: 0.5 }); // normalized [0..1]

  const mainRef = useRef<HTMLDivElement | null>(null);

  const activeSrc = safeImages[Math.min(activeIndex, Math.max(0, safeImages.length - 1))];

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < safeImages.length - 1;

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(safeImages.length - 1, i + 1));

  const onMove = (e: React.MouseEvent) => {
    const el = mainRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;

    // Lens sınırlandırma (kenarlara yapışmasın diye biraz içeri al)
    setLens({
      x: clamp(nx, 0.06, 0.94),
      y: clamp(ny, 0.06, 0.94),
    });
  };

  // Lens boyutu (ana görsel üzerindeki küçük kutu)
  const LENS_PX = 110;
  // Zoom ölçeği (sağ panelde ne kadar büyüsün)
  const ZOOM_SCALE = 2.6;

  if (!activeSrc) {
    return (
      <div className={`rounded-2xl bg-slate-100 border border-slate-200 ${className ?? ""}`}>
        <div className="aspect-[4/5] w-full" />
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${className ?? ""} md:grid-cols-[1fr,0.9fr]`}>
      {/* SOL: Ana Görsel + Oklar + Lens */}
      <div className="space-y-3">
        <div
          ref={mainRef}
          className="
            relative overflow-hidden rounded-2xl border border-slate-200 bg-white
            shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          "
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onMouseMove={onMove}
        >
          {/* Ana görsel oranı: daha dikey */}
          <div className="aspect-[4/5] w-full">
            <img
              src={activeSrc}
              alt={alt}
              className="h-full w-full object-contain"
              draggable={false}
            />
          </div>

          {/* Sol/Sağ oklar */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                disabled={!canPrev}
                className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  h-10 w-10 rounded-full border border-slate-200 bg-white/90
                  shadow-sm backdrop-blur
                  flex items-center justify-center
                  transition
                  ${canPrev ? "hover:bg-white" : "opacity-40 cursor-not-allowed"}
                `}
                aria-label="Önceki görsel"
              >
                <span className="text-xl leading-none">‹</span>
              </button>

              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className={`
                  absolute right-3 top-1/2 -translate-y-1/2
                  h-10 w-10 rounded-full border border-slate-200 bg-white/90
                  shadow-sm backdrop-blur
                  flex items-center justify-center
                  transition
                  ${canNext ? "hover:bg-white" : "opacity-40 cursor-not-allowed"}
                `}
                aria-label="Sonraki görsel"
              >
                <span className="text-xl leading-none">›</span>
              </button>
            </>
          )}

          {/* Lens (sadece desktop hover) */}
          <div className={`hidden md:block ${isHover ? "opacity-100" : "opacity-0"} transition-opacity`}>
            <div
              className="absolute border-2 border-slate-900/70 bg-white/20 rounded-lg pointer-events-none"
              style={{
                width: LENS_PX,
                height: LENS_PX,
                left: `calc(${lens.x * 100}% - ${LENS_PX / 2}px)`,
                top: `calc(${lens.y * 100}% - ${LENS_PX / 2}px)`,
              }}
            />
          </div>
        </div>

        {/* Thumbnail şeridi */}
        {safeImages.length > 1 && (
          <div className="flex gap-2">
            {safeImages.map((src, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`
                    h-14 w-14 overflow-hidden rounded-xl border
                    ${active ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-200 hover:border-slate-300"}
                    bg-white
                  `}
                  aria-label={`Görsel ${idx + 1}`}
                >
                  <img src={src} alt={`${alt} ${idx + 1}`} className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        )}

        <div className="text-xs text-slate-500">
          İpucu: Fareyi görsel üzerinde gezdirince sağda yakınlaştırma görünür.
        </div>
      </div>

      {/* SAĞ: Trendyol tarzı zoom panel */}
      <div className="hidden md:block">
        <div
          className="
            relative overflow-hidden rounded-2xl border border-slate-200 bg-white
            shadow-[0_10px_40px_rgba(0,0,0,0.08)]
            h-full
          "
        >
          <div className="aspect-[4/5] w-full" />

          {/* Zoom içerik: background ile büyüt */}
          <div
            className={`absolute inset-0 transition-opacity ${isHover ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: `url(${activeSrc})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${ZOOM_SCALE * 100}% ${ZOOM_SCALE * 100}%`,
              backgroundPosition: `${lens.x * 100}% ${lens.y * 100}%`,
            }}
          />

          {!isHover && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
              Yakınlaştırma için görselin üstüne gel
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
