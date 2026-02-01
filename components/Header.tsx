"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
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
const SIDE_COL = "w-[180px]"; // logo kadar boşluk (menü ortalama için)

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC ile kapatma (soft UX)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const activePath = useMemo(() => pathname || "", [pathname]);

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

          {/* Sağ: Logo kadar boşluk + mobile button */}
          <div className={`flex-shrink-0 ${SIDE_COL} flex items-center justify-end`}>
            <button
              type="button"
              aria-label="Menüyü aç"
              className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Menu (animasyonlu) */}
      <div
        className={`
          md:hidden fixed inset-0 z-[60]
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
        aria-hidden={!open}
      >
        {/* Backdrop (fade) */}
        <button
          aria-label="Menüyü kapat"
          onClick={() => setOpen(false)}
          className={`
            absolute inset-0
            bg-black/65
            transition-opacity duration-300 ease-out
            ${open ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Panel (slide down + blur soft) */}
        <div
          className={`
            absolute inset-x-0 top-0
            bg-[#FAFAF7]
            border-b border-slate-200
            transition-transform duration-300 ease-out
            ${open ? "translate-y-0" : "-translate-y-6"}
          `}
          style={{
            // iOS safe area için küçük iyileştirme
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          {/* Top bar */}
          <div className="flex h-20 items-center justify-between px-6">
            {/* ✅ Aynı logo ölçüsü */}
            <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
              <img src="/logo.png" alt="KesioLabs" className={LOGO_CLASS} draggable={false} />
            </Link>

            {/* Close button */}
            <button
              type="button"
              aria-label="Menüyü kapat"
              className="inline-flex items-center justify-center rounded-2xl p-3 text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              onClick={() => setOpen(false)}
            >
              <X size={28} />
            </button>
          </div>

          {/* Links (stagger animasyon) */}
          <nav className="px-6 pb-8">
            <ul className="flex flex-col gap-4">
              {navItems.map((item, idx) => {
                const isActive = activePath === item.href;
                return (
                  <li
                    key={item.href}
                    className={`
                      transition-all duration-300 ease-out
                      ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                    `}
                    style={{
                      transitionDelay: open ? `${70 + idx * 55}ms` : "0ms",
                    }}
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
