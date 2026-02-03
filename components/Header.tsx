"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Ana Sayfa", href: "/main" },
  { label: "Teklif Al", href: "/quote" },
  { label: "Ürün Kataloğu", href: "/products" },
  { label: "Firmanıza Özel Ürünler", href: "/custom-products" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/about" },
];

const LOGO_CLASS = "h-10 w-auto"; // 40px
const SIDE_COL = "w-[180px]";

// Premium easing
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Brand colors
const BRAND_BLUE_RGB = "11, 74, 162"; // #0B4AA2 (çok dikkatli)
const BRAND_ORANGE = "#ff7a00";

// Kaydırma adımı
const SCROLL_STEP = 260;

// Ok kolonlarının genişliği (taşma varsa görünür)
const ARROW_COL = "w-[44px]"; // 44px = temiz, compact

function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnimatedBurger({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "relative block h-6 w-6",
        "transition-transform duration-300",
        EASE,
        open ? "scale-[0.98]" : "scale-100",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* üst çizgi */}
      <span
        className={[
          "absolute left-0 top-[6px] h-[2px] w-6 rounded-full bg-slate-700",
          "transform-gpu",
          "transition-all duration-300",
          EASE,
          open ? "translate-y-[6px] rotate-45" : "translate-y-0 rotate-0",
        ].join(" ")}
      />
      {/* orta çizgi */}
      <span
        className={[
          "absolute left-0 top-[12px] h-[2px] w-6 rounded-full bg-slate-700",
          "transform-gpu",
          "transition-all duration-200",
          EASE,
          open ? "opacity-0 scale-x-50" : "opacity-100 scale-x-100",
        ].join(" ")}
      />
      {/* alt çizgi */}
      <span
        className={[
          "absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-slate-700",
          "transform-gpu",
          "transition-all duration-300",
          EASE,
          open ? "-translate-y-[6px] -rotate-45" : "translate-y-0 rotate-0",
        ].join(" ")}
      />
    </span>
  );
}

function ArrowButton({
  dir,
  onClick,
}: {
  dir: "left" | "right";
  onClick: () => void;
}) {
  // Premium ghost + ince mavi ring + çok hafif hint
  const commonClass = [
    "h-9 w-9 rounded-full",
    "flex items-center justify-center",
    "transition-all duration-200",
    EASE,
    "border bg-transparent",
    "shadow-[0_6px_18px_rgba(15,23,42,0.08)]",
    "hover:shadow-[0_10px_24px_rgba(15,23,42,0.10)]",
    "active:scale-[0.98]",
  ].join(" ");

  const style: React.CSSProperties = {
    borderColor: `rgba(${BRAND_BLUE_RGB}, 0.18)`,
    background:
      dir === "left"
        ? `linear-gradient(to right, rgba(${BRAND_BLUE_RGB}, 0.08), rgba(${BRAND_BLUE_RGB}, 0.00))`
        : `linear-gradient(to left, rgba(${BRAND_BLUE_RGB}, 0.08), rgba(${BRAND_BLUE_RGB}, 0.00))`,
  };

  return (
    <button type="button" aria-label={dir === "left" ? "Menüyü sola kaydır" : "Menüyü sağa kaydır"} onClick={onClick} className={commonClass} style={style}>
      {dir === "left" ? <ChevronLeft className="text-[#ff7a00]" /> : <ChevronRight className="text-[#ff7a00]" />}
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activePath = useMemo(() => pathname || "", [pathname]);

  // Yatay nav kontrolü
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateOverflowState = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);

    const left = el.scrollLeft > 2;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;

    setCanLeft(overflow && left);
    setCanRight(overflow && right);
  };

  const scrollByDir = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir === "left" ? -SCROLL_STEP : SCROLL_STEP;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Mouse wheel: dikey teker -> yatay kaydırma
  const onWheelHorizontal = (e: React.WheelEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    if (!hasOverflow) return;

    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    const move = dx > dy ? e.deltaX : e.deltaY;

    e.preventDefault();
    el.scrollLeft += move;
  };

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Overflow state
  useEffect(() => {
    updateOverflowState();

    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => updateOverflowState();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateOverflowState());
    ro.observe(el);

    const t = window.setTimeout(updateOverflowState, 60);
    window.addEventListener("resize", updateOverflowState);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", updateOverflowState);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePath]);

  // Ok kolonları "yokmuş gibi": overflow yoksa width 0 + opacity 0 + pointer-events none
  const leftArrowVisible = hasOverflow && canLeft;
  const rightArrowVisible = hasOverflow && canRight;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF7] border-b border-slate-200">
      <div className="w-full px-6">
        <div className="flex h-20 items-center">
          {/* [ SOL BLOK ] (logo) */}
          <div className={`flex-shrink-0 ${SIDE_COL}`}>
            <Link href="/" className="inline-flex" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
            </Link>
          </div>

          {/* [ SOL YÖN OKU ] (ayrı kolon) */}
          <div
            className={[
              "hidden md:flex flex-shrink-0 items-center justify-center",
              "transition-[width,opacity] duration-200",
              EASE,
              hasOverflow ? ARROW_COL : "w-0",
              leftArrowVisible ? "opacity-100" : "opacity-0",
              hasOverflow ? "" : "pointer-events-none",
            ].join(" ")}
          >
            {/* overflow var ama en soldaysak: kolon dursun ama buton pasif kalsın */}
            {hasOverflow && (
              <div className={leftArrowVisible ? "" : "opacity-0 pointer-events-none"}>
                <ArrowButton dir="left" onClick={() => scrollByDir("left")} />
              </div>
            )}
          </div>

          {/* [ ORTA NAV ] */}
          <nav className="hidden md:flex flex-1 min-w-0 justify-center">
            <div
              ref={scrollerRef}
              className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap scroll-smooth"
              onWheel={onWheelHorizontal}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {navItems.map((item, i) => (
                <div key={item.href} className="flex items-center gap-8">
                  <Link
                    href={item.href}
                    className={`
                      shrink-0 transition-colors duration-200
                      ${
                        activePath === item.href
                          ? "text-[#ff7a00] font-semibold"
                          : "text-slate-700 hover:text-[#ff7a00]"
                      }
                    `}
                  >
                    {item.label}
                  </Link>

                  {i !== navItems.length - 1 && (
                    <span className="h-5 w-px bg-slate-200 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* [ SAĞ YÖN OKU ] (ayrı kolon) */}
          <div
            className={[
              "hidden md:flex flex-shrink-0 items-center justify-center",
              "transition-[width,opacity] duration-200",
              EASE,
              hasOverflow ? ARROW_COL : "w-0",
              rightArrowVisible ? "opacity-100" : "opacity-0",
              hasOverflow ? "" : "pointer-events-none",
            ].join(" ")}
          >
            {hasOverflow && (
              <div className={rightArrowVisible ? "" : "opacity-0 pointer-events-none"}>
                <ArrowButton dir="right" onClick={() => scrollByDir("right")} />
              </div>
            )}
          </div>

          {/* [ SAĞ BLOK ] (boş + mobile burger) */}
          <div className={`flex-shrink-0 ${SIDE_COL} flex items-center justify-end`}>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className={[
                "md:hidden inline-flex items-center justify-center rounded-xl p-2",
                "hover:bg-slate-100 transition-colors",
              ].join(" ")}
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatedBurger open={open} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <div
        className={[
          "md:hidden fixed inset-0 z-[60]",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 backdrop-soft",
            "transition-opacity duration-300",
            EASE,
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Sheet */}
        <div
          className={[
            "absolute right-0 top-0 h-full w-[86%] max-w-[420px]",
            "bg-[#FAFAF7] border-l border-slate-200 shadow-2xl sheet-edge",
            "transform-gpu transition-all duration-300",
            EASE,
            open
              ? "translate-x-0 opacity-100 scale-100 animate-sheet-in"
              : "translate-x-full opacity-0 scale-[0.98]",
          ].join(" ")}
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Sheet header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200">
            <p className="pr-4 text-[15px] leading-snug italic text-slate-500">
              Üretimde yeni nesil.
            </p>

            <button
              type="button"
              aria-label="Menüyü kapat"
              className="inline-flex items-center justify-center rounded-2xl p-2 hover:bg-slate-100 transition"
              onClick={() => setOpen(false)}
            >
              <AnimatedBurger open={true} />
            </button>
          </div>

          {/* Links */}
          <nav className="px-6 py-6">
            <ul className="flex flex-col gap-4">
              {navItems.map((item, idx) => {
                const isActive = activePath === item.href;
                return (
                  <li
                    key={item.href}
                    className={[
                      "transform-gpu transition-all duration-300",
                      EASE,
                      open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
                    ].join(" ")}
                    style={{ transitionDelay: open ? `${110 + idx * 55}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        menu-card-pop
                        block w-full rounded-2xl px-5 py-4
                        text-[18px] font-semibold
                        border shadow-sm transition-colors
                        ${
                          isActive
                            ? "text-[#ff7a00] border-[#ff7a00] bg-orange-50"
                            : "text-slate-900 bg-white border-slate-200 hover:bg-slate-50 hover:text-[#ff7a00]"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
