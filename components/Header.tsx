"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Ana Sayfa", href: "/main" },
  { label: "Teklif Al", href: "/quote" },
  { label: "Firmanıza Özel Ürünler", href: "/custom-products" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/about" },
  { label: "İletişim", href: "/contact" },
];

const LOGO_CLASS = "h-10 w-auto";
const SIDE_COL = "w-[180px]";
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const SCROLL_STEP = 260;
const ARROW_COL = "w-[44px]";

function ChevronLeft({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
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
      <span
        className={[
          "absolute left-0 top-[6px] h-[2px] w-6 rounded-full bg-slate-200",
          "transform-gpu transition-all duration-300",
          EASE,
          open ? "translate-y-[6px] rotate-45" : "translate-y-0 rotate-0",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[12px] h-[2px] w-6 rounded-full bg-slate-200",
          "transform-gpu transition-all duration-200",
          EASE,
          open ? "opacity-0 scale-x-50" : "opacity-100 scale-x-100",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-slate-200",
          "transform-gpu transition-all duration-300",
          EASE,
          open ? "-translate-y-[6px] -rotate-45" : "translate-y-0 rotate-0",
        ].join(" ")}
      />
    </span>
  );
}

function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const commonClass = [
    "h-9 w-9 rounded-full",
    "flex items-center justify-center",
    "transition-all duration-300",
    EASE,
    "border border-white/10 bg-white/5 backdrop-blur-md",
    "shadow-[0_0_15px_rgba(0,0,0,0.2)]",
    "hover:bg-white/10 hover:border-indigo-500/30",
    "active:scale-[0.95]",
  ].join(" ");

  return (
    <button type="button" aria-label={dir === "left" ? "Menüyü sola kaydır" : "Menüyü sağa kaydır"} onClick={onClick} className={commonClass}>
      {dir === "left" ? <ChevronLeft className="text-indigo-400" /> : <ChevronRight className="text-indigo-400" />}
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activePath = useMemo(() => pathname || "", [pathname]);

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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
  }, [activePath]);

  const leftArrowVisible = hasOverflow && canLeft;
  const rightArrowVisible = hasOverflow && canRight;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1120]/80 backdrop-blur-lg border-b border-white/10 shadow-lg font-sans">
      <div className="w-full px-6 max-w-[1600px] mx-auto">
        <div className="flex h-20 items-center justify-between md:justify-start">
          
          {/* [ SOL BLOK ] (logo) */}
          <div className="flex-shrink-0 w-auto md:w-[180px]">
            <Link href="/" className="inline-flex hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
            </Link>
          </div>

          {/* [ SOL YÖN OKU ] */}
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
              className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap scroll-smooth px-4"
              onWheel={onWheelHorizontal}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {navItems.map((item, i) => (
                <div key={item.href} className="flex items-center gap-8">
                  <Link
                    href={item.href}
                    className={`
                      shrink-0 transition-colors duration-300 text-sm font-medium tracking-wide
                      ${activePath === item.href
                          ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                          : "text-slate-300 hover:text-white"
                      }
                    `}
                  >
                    {item.label}
                  </Link>

                  {i !== navItems.length - 1 && (
                    <span className="h-4 w-px bg-white/10 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* [ SAĞ YÖN OKU ] */}
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

          {/* [ SAĞ BLOK ] (mobile burger) */}
          <div className="flex-shrink-0 w-auto md:w-[180px] flex items-center justify-end">
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatedBurger open={open} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE SHEET (SAĞDAN AÇILAN MENÜ) --- */}
      <div
        className={[
          "md:hidden fixed inset-0 z-[60]",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Backdrop (Karanlık Arka Plan) */}
        <button
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-black/60 backdrop-blur-sm",
            "transition-opacity duration-300",
            EASE,
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Sheet Panel (Buzlu Cam Panel) */}
        <div
          className={[
            "absolute right-0 top-0 h-full w-[86%] max-w-[420px]",
            "bg-[#0b1120]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl",
            "transform-gpu transition-all duration-300 flex flex-col",
            EASE,
            open ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-[0.98]",
          ].join(" ")}
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* Sheet Header */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 shrink-0">
            <p className="text-[13px] font-medium tracking-widest uppercase text-indigo-400/80">
              KesioLabs
            </p>
            <button
              type="button"
              aria-label="Menüyü kapat"
              className="inline-flex items-center justify-center rounded-xl p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              onClick={() => setOpen(false)}
            >
              <AnimatedBurger open={true} />
            </button>
          </div>

          {/* Links (Mobil Menü Kartları) */}
          <nav className="px-6 py-8 overflow-y-auto flex-1">
            <ul className="flex flex-col gap-4">
              {navItems.map((item, idx) => {
                const isActive = activePath === item.href;
                return (
                  <li
                    key={item.href}
                    className={[
                      "transform-gpu transition-all duration-500",
                      EASE,
                      open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
                    ].join(" ")}
                    style={{ transitionDelay: open ? `${100 + idx * 60}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        block w-full rounded-2xl px-5 py-4
                        text-[16px] font-semibold transition-all duration-300
                        border backdrop-blur-md
                        ${isActive
                            ? "text-indigo-300 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                            : "text-slate-300 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 hover:text-white"
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
