"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF7] border-b border-slate-200">
      <div className="w-full px-6">
        {/* Tek satır: Logo - Nav (scroll) - Mobile button */}
       <div className="flex h-20 items-center">
  {/* Sol: Logo */}
  <div className="flex-shrink-0 w-[160px]">
    <Link href="/" onClick={() => setOpen(false)}>
      <img
        src="/logo.png"
        alt="KesioLabs"
        className="h-8 w-auto"
        draggable={false}
      />
    </Link>
  </div>

  {/* Orta: Menü */}
  <nav className="hidden md:flex flex-1 min-w-0 justify-center">
    <div className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap">
      {navItems.map((item, i) => (
        <div key={item.href} className="flex items-center gap-8">
          <Link
            href={item.href}
            className={`
              shrink-0 transition-colors duration-200
              ${
                pathname === item.href
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

  {/* Sağ: Logo kadar boşluk (dengeleyici) */}
  <div className="flex-shrink-0 w-[160px]" />
</div>
          {/* Logo */}
          <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
            <img
              src="/logo.png"
              alt="KesioLabs"
              className="h-8 w-auto"
              draggable={false}
            />
          </Link>

          {/* Desktop/Tablet nav: tek satır + kendi içinde yatay scroll */}
          <nav className="hidden md:flex flex-1 min-w-0 justify-center">
            <div className="no-scrollbar flex items-center gap-8 overflow-x-auto whitespace-nowrap">
              {navItems.map((item, i) => (
                <div key={item.href} className="flex items-center gap-8">
                  <Link
                    href={item.href}
                    className={`
                      shrink-0 transition-colors duration-200
                      ${
                        pathname === item.href
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

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Menüyü aç"
            className="md:hidden ml-auto inline-flex items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <button
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-black/65"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-0 bg-[#FAFAF7]">
            {/* Top bar */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200">
              <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
                <img
                  src="/logo.png"
                  alt="KesioLabs"
                  className="h-8 w-auto"
                  draggable={false}
                />
              </Link>

              <button
                type="button"
                aria-label="Menüyü kapat"
                className="inline-flex items-center justify-center rounded-2xl p-3 text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                onClick={() => setOpen(false)}
              >
                <X size={28} />
              </button>
            </div>

            {/* Links */}
            <nav className="px-6 py-6">
              <ul className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`
                        block w-full
                        rounded-2xl px-5 py-4
                        text-[18px] font-semibold
                        border shadow-sm transition-colors
                        ${
                          pathname === item.href
                            ? "text-[#ff7a00] border-[#ff7a00] bg-orange-50"
                            : "text-slate-900 bg-white border-slate-200 hover:bg-slate-50 hover:text-[#ff7a00]"
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
