"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import type { CatalogCategory } from "@/lib/strapi";

type MenuName = "products" | "articles" | null;
const articleLinks = [
  { label: "Tüm Makaleler", href: "/makaleler" },
  { label: "Haberler", href: "/makaleler/haberler" },
  { label: "Uygulama Notları", href: "/makaleler/uygulama-notlari" },
];

export default function Header({ categories = [] }: { categories?: CatalogCategory[] }) {
  const pathname = usePathname();
  const [desktopMenu, setDesktopMenu] = useState<MenuName>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuName>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setDesktopMenu(null);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setDesktopMenu(null); setMobileOpen(false); }
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => { document.removeEventListener("mousedown", closeOutside); document.removeEventListener("keydown", closeEscape); };
  }, []);

  const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const linkClass = (href: string) => `px-1 py-3 text-sm font-semibold tracking-[0.01em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C] focus-visible:ring-offset-4 ${active(href) ? "text-[#DA291C]" : "text-black hover:text-[#DA291C]"}`;

  return (
    <header ref={rootRef} onClick={(event) => { if ((event.target as Element).closest("a")) { setDesktopMenu(null); setMobileOpen(false); } }} className="sticky top-0 z-[100] border-b border-black/10 bg-white/95 text-black shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex h-[76px] shrink-0 items-center overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]" aria-label="Kesiolabs ana sayfa">
          <Image src="/kesiolabs-official-logo.png" alt="Kesiolabs" width={2172} height={724} priority className="h-[88px] w-auto max-w-none object-contain sm:h-[104px]" />
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Ana navigasyon">
          <Link className={linkClass("/")} href="/">Anasayfa</Link>
          <Link className={linkClass("/about")} href="/about">Hakkımızda</Link>
          <div className="relative">
            <button type="button" className={`${linkClass("/products")} inline-flex items-center gap-1.5`} aria-expanded={desktopMenu === "products"} aria-controls="products-menu" onClick={() => setDesktopMenu(desktopMenu === "products" ? null : "products")}>Ürünler <ChevronDown className={`h-4 w-4 transition-transform ${desktopMenu === "products" ? "rotate-180" : ""}`} /></button>
            {desktopMenu === "products" && (
              <div id="products-menu" className="absolute left-1/2 top-full mt-3 w-[min(760px,80vw)] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
                <div className="flex items-center justify-between border-b border-black/10 px-3 pb-3">
                  <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">Ürün kataloğu</p><p className="mt-1 text-sm text-black/60">Kategorilere göre üretim çözümlerini inceleyin.</p></div>
                  <Link href="/products" className="rounded-lg bg-[#DA291C] px-4 py-2 text-sm font-bold text-white hover:bg-black">Tüm ürünler</Link>
                </div>
                {categories.length ? <div className="grid grid-cols-2 gap-1 pt-3">{categories.map((category) => <Link key={category.key} href={`/products?category=${encodeURIComponent(category.key)}`} className="rounded-xl p-3 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA291C]"><span className="block text-sm font-bold">{category.label}</span>{category.description && <span className="mt-1 block line-clamp-2 text-xs leading-5 text-black/55">{category.description}</span>}</Link>)}</div> : <Link href="/products" className="mt-3 block rounded-xl bg-black/[0.03] p-4 text-sm font-semibold">Ürünler sayfasına git</Link>}
              </div>
            )}
          </div>
          <Link className={linkClass("/temsilcilikler")} href="/temsilcilikler">Temsilcilikler</Link>
          <div className="relative">
            <button type="button" className={`${linkClass("/makaleler")} inline-flex items-center gap-1.5`} aria-expanded={desktopMenu === "articles"} aria-controls="articles-menu" onClick={() => setDesktopMenu(desktopMenu === "articles" ? null : "articles")}>Makaleler <ChevronDown className={`h-4 w-4 transition-transform ${desktopMenu === "articles" ? "rotate-180" : ""}`} /></button>
            {desktopMenu === "articles" && <div id="articles-menu" className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-black/10 bg-white p-2 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">{articleLinks.map((item) => <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-black/[0.04] hover:text-[#DA291C]">{item.label}</Link>)}</div>}
          </div>
          <Link className={linkClass("/contact")} href="/contact">İletişim</Link>
        </nav>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center border border-black/15 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
      </div>
      {mobileOpen && (
        <nav id="mobile-navigation" className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-black/10 bg-white px-5 py-5 lg:hidden" aria-label="Mobil navigasyon">
          <div className="mx-auto flex max-w-xl flex-col">
            <Link href="/" className="border-b border-black/10 py-4 font-semibold">Anasayfa</Link><Link href="/about" className="border-b border-black/10 py-4 font-semibold">Hakkımızda</Link>
            <button type="button" onClick={() => setMobileSection(mobileSection === "products" ? null : "products")} className="flex items-center justify-between border-b border-black/10 py-4 text-left font-semibold" aria-expanded={mobileSection === "products"}>Ürünler <ChevronDown className={`h-4 w-4 ${mobileSection === "products" ? "rotate-180" : ""}`} /></button>
            {mobileSection === "products" && <div className="border-b border-black/10 bg-black/[0.025] px-4 py-2"><Link href="/products" className="block py-3 font-bold text-[#DA291C]">Tüm ürünler</Link>{categories.map((category) => <Link key={category.key} href={`/products?category=${encodeURIComponent(category.key)}`} className="block py-3 text-sm font-medium">{category.label}</Link>)}</div>}
            <Link href="/temsilcilikler" className="border-b border-black/10 py-4 font-semibold">Temsilcilikler</Link>
            <button type="button" onClick={() => setMobileSection(mobileSection === "articles" ? null : "articles")} className="flex items-center justify-between border-b border-black/10 py-4 text-left font-semibold" aria-expanded={mobileSection === "articles"}>Makaleler <ChevronDown className={`h-4 w-4 ${mobileSection === "articles" ? "rotate-180" : ""}`} /></button>
            {mobileSection === "articles" && <div className="border-b border-black/10 bg-black/[0.025] px-4 py-2">{articleLinks.map((item) => <Link key={item.href} href={item.href} className="block py-3 text-sm font-medium">{item.label}</Link>)}</div>}
            <Link href="/contact" className="py-4 font-semibold">İletişim</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
