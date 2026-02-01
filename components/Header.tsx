"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Ana Sayfa", href: "/main" },
  { label: "Teklif Al", href: "/quote" },
  { label: "Ürün Kataloğu", href: "/products" },
  { label: "Firmanıza Özel Ürünler", href: "/custom-products" },
  { label: "Blog", href: "/blog" },
  { label: "Hakkımızda", href: "/about" },
];

// ✅ Tek kaynaktan logo ölçüsü
const LOGO_CLASS = "h-10 w-auto"; // 40px
const SIDE_COL = "w-[180px]"; // menü ortalamak için sağ/sol eş alan

function AnimatedBurger({ open }: { open: boolean }) {
  // Hamburger -> X dönüşümü (pure CSS)
  return (
    <span className="relative block h-6 w-6" aria-hidden="true">
      <span
        className={[
          "absolute left-0 top-[6px] h-[2px] w-6 rounded-full bg-slate-700",
          "transition-transform transition-opacity duration-200 ease-out",
          open ? "translate-y-[6px] rotate-45" : "",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[12px] h-[2px] w-6 rounded-full bg-slate-700",
          "transition-opacity duration-150 ease-out",
          open ? "opacity-0" : "opacity-100",
        ].join(" ")}
      />
      <span
        className={[
          "absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-slate-700",
          "transition-transform transition-opacity duration-200 ease-out",
          open ? "-translate-y-[6px] -rotate-45" : "",
        ].join(" ")}
      />
    </span>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activePath = useMemo(() => pathname || "", [pathname]);

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF7] border-b border-slate-200">
      <div className="w-full px-6">
        <div className="flex h-20 items-center">
          {/* Sol: Logo */}
          <div className={`flex-shrink-0 ${SIDE_COL}`}>
            <Link href="/" className="inline-flex" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
            </Link>
          </div>

          {/* Orta: Desktop/Tablet nav */}
          <nav className="hidden md:flex flex-1 min-w-0 justify-center">
            <div className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap">
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

          {/* Sağ: Boşluk + mobile toggle */}
          <div className={`flex-shrink-0 ${SIDE_COL} flex items-center justify-end`}>
            <button
              type="button"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 hover:bg-slate-100 transition"
              onClick={() => setOpen((v) => !v)}
            >
              <AnimatedBurger open={open} />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ iOS-style Sheet Menu (sağdan açılır) */}
      <div
        className={[
          "md:hidden fixed inset-0 z-[60]",
          open ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Backdrop fade */}
        <button
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className={[
            "absolute inset-0 bg-black/60",
            "transition-opacity duration-300 ease-out",
            open ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* Sheet (right side) */}
        <div
          className={[
            "absolute right-0 top-0 h-full w-[86%] max-w-[420px]",
            "bg-[#FAFAF7] border-l border-slate-200",
            "shadow-2xl",
            "transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
         {/* Sheet top bar (LOGO YOK, YAZI VAR) */}
<div className="flex min-h-[88px] items-center justify-between px-6 border-b border-slate-200">
  <p className="pr-4 text-[13px] leading-relaxed italic text-slate-500">
    KesioLabs, dijital üretim teknolojilerini yaratıcı ve mühendislik odaklı
    tasarım süreçleriyle birleştiren modern bir üretim stüdyosudur.
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

          {/* Links (stagger + soft) */}
          <nav className="px-6 py-6">
            <ul className="flex flex-col gap-4">
              {navItems.map((item, idx) => {
                const isActive = activePath === item.href;
                return (
                  <li
                    key={item.href}
                    className={[
                      "transition-all duration-300 ease-out",
                      open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
                    ].join(" ")}
                    style={{ transitionDelay: open ? `${90 + idx * 55}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        block w-full
                        rounded-2xl px-5 py-4
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
