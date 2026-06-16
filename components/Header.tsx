"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", href: "/main" },
  { label: "Teklif Al", href: "/quote" },
  { label: "Firmanıza Özel Ürünler", href: "/custom-products" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/about" },
  { label: "İletişim", href: "/contact" },
];

const LOGO_CLASS = "h-9 w-auto brightness-200 contrast-125 object-contain";
const EASE = "transparent transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)";
const SCROLL_STEP = 260;
const ARROW_COL = "w-[44px]";

// --- ELITE & PREMIUM ANIMATED BURGER BUTTON ---
function PremiumBurger({ open }: { open: boolean }) {
  return (
    <div className="relative w-6 h-5 flex flex-col justify-between items-end group-hover:scale-105 transition-transform duration-300">
      <span 
        className={`h-[2px] rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-right
          ${open ? "w-6 -rotate-45 translate-y-[1px] translate-x-[-1px]" : "w-6 group-hover:w-4"}`} 
      />
      <span 
        className={`h-[2px] rounded-full bg-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? "w-0 opacity-0" : "w-4 group-hover:w-6"}`} 
      />
      <span 
        className={`h-[2px] rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-right
          ${open ? "w-6 rotate-45 -translate-y-[1px] translate-x-[-1px]" : "w-5 group-hover:w-3"}`} 
      />
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button 
      type="button" 
      onClick={onClick} 
      className="h-9 w-9 rounded-full flex items-center justify-center shrink-0 border border-white/10 bg-[#0b1120] backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-indigo-500/30 active:scale-95 transition-all duration-300"
    >
      {dir === "left" ? <ChevronLeft className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-indigo-400" />}
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ARKA PLAN SCROLL LOCK
  useEffect(() => {
    if (open) {
      document.documentElement.style.setProperty("overflow", "hidden", "important");
      document.body.style.setProperty("overflow", "hidden", "important");
      document.body.style.setProperty("position", "relative", "important");
    } else {
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
    }
    return () => {
      document.documentElement.style.removeProperty("overflow");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("position");
    };
  }, [open]);

  const updateOverflowState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanLeft(overflow && el.scrollLeft > 2);
    setCanRight(overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  const scrollByDir = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -SCROLL_STEP : SCROLL_STEP, behavior: "smooth" });
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[999] w-full transition-all duration-500 font-sans border-b
          ${isScrolled 
            ? "bg-[#0b1120]/95 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-2" 
            : "bg-[#0b1120]/40 backdrop-blur-md border-transparent py-4"}
        `}
      >
        <div className="w-full px-4 md:px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between md:justify-start h-14">
            
            {/* LOGO */}
            <div className="flex-shrink-0 w-auto md:w-[220px]">
              <Link href="/" className="inline-flex hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
                <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
              </Link>
            </div>

            {/* NAV OKU - SOL */}
            <div className={`hidden md:flex flex-shrink-0 items-center justify-center transition-all duration-300 ${hasOverflow ? ARROW_COL : "w-0"} ${hasOverflow && canLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <ArrowButton dir="left" onClick={() => scrollByDir("left")} />
            </div>

            {/* MASAÜSTÜ NAVİGASYON */}
            <nav className="hidden md:flex flex-1 min-w-0 justify-center">
              <div
                ref={scrollerRef}
                className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap scroll-smooth px-4"
                onWheel={(e) => {
                  if (!hasOverflow) return;
                  e.preventDefault();
                  if (scrollerRef.current) scrollerRef.current.scrollLeft += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                }}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {navItems.map((item, i) => (
                  <div key={item.href} className="flex items-center gap-8">
                    <Link
                      href={item.href}
                      className={`shrink-0 transition-all duration-300 text-[14px] font-semibold tracking-wide ${activePath === item.href ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-slate-300 hover:text-white"}`}
                    >
                      {item.label}
                    </Link>
                    {i !== navItems.length - 1 && <span className="h-4 w-px bg-white/10 shrink-0" />}
                  </div>
                ))}
              </div>
            </nav>

            {/* NAV OKU - SAĞ */}
            <div className={`hidden md:flex flex-shrink-0 items-center justify-center transition-all duration-300 ${hasOverflow ? ARROW_COL : "w-0"} ${hasOverflow && canRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
              <ArrowButton dir="right" onClick={() => scrollByDir("right")} />
            </div>

            {/* MOBİL BURGER BUTON */}
            <div className="flex-shrink-0 w-auto md:w-[220px] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="group md:hidden inline-flex items-center justify-center rounded-xl w-12 h-12 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 outline-none"
              >
                <PremiumBurger open={open} />
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBİL MENÜ PANELİ --- */}
        <div
          className={`md:hidden fixed inset-0 z-[9999] w-screen h-[100dvh] touch-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
          {/* Arka Plan Buzlu Karartma */}
          <div
            onClick={() => setOpen(false)}
            className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-out ${open ? "opacity-100" : "opacity-0"}`}
          />

          {/* Sağdan Kayan Panel */}
          <div
            className={`absolute right-0 top-0 h-full w-[85%] max-w-[360px] bg-[#0b1120] border-l border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              ${open ? "translate-x-0" : "translate-x-full"}`}
          >
            {/* Üst Kısım */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/10 shrink-0">
              <Link href="/" onClick={() => setOpen(false)} className="inline-flex">
                <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="group inline-flex items-center justify-center rounded-xl w-10 h-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-colors outline-none"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Linkler */}
            <nav className="px-6 py-8 overflow-y-auto flex-1">
              <ul className="flex flex-col gap-3.5">
                {navItems.map((item, idx) => {
                  const isActive = activePath === item.href;
                  return (
                    <li
                      key={item.href}
                      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
                      style={{ transitionDelay: open ? `${120 + idx * 40}ms` : "0ms" }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block w-full rounded-2xl px-5 py-4 text-[15px] font-bold tracking-wide transition-all duration-300 border backdrop-blur-md
                          ${isActive
                            ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                            : "text-slate-300 bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/20 hover:text-white"}`}
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

      <div className="h-20 bg-[#0b1120] w-full" />
    </>
  );
}
