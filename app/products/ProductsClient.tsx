"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, Filter, ImageIcon, Search, X } from "lucide-react";
import type { CatalogCategory, CatalogProduct } from "@/lib/strapi";

function filterHref(category: string, query: string) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (query) params.set("q", query);
  const search = params.toString();
  return `/products${search ? `?${search}` : ""}`;
}

export default function ProductsClient({ products, categories }: { products: CatalogProduct[]; categories: CatalogCategory[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category") ?? "all";
  const category = categories.some((item) => item.key === requestedCategory) ? requestedCategory : "all";
  const query = searchParams.get("q") ?? "";
  const [mobileOpen, setMobileOpen] = useState(false);
  const categoryNames = new Map(categories.map((item) => [item.key, item.label]));
  const filtered = useMemo(() => products.filter((product) => {
    const categoryMatch = category === "all" || product.category === category;
    const haystack = `${product.title} ${product.model} ${product.manufacturer} ${product.shortDescription}`.toLocaleLowerCase("tr");
    return categoryMatch && haystack.includes(query.toLocaleLowerCase("tr").trim());
  }), [products, category, query]);

  const categoriesList = (mobile = false) => (
    <nav aria-label="Ürün kategorileri" className="space-y-1">
      {[{ key: "all", label: "Tümü" }, ...categories].map((item) => (
        <Link key={item.key} href={filterHref(item.key, query)} onClick={() => mobile && setMobileOpen(false)} className={`flex items-center justify-between border-l-2 px-4 py-3 text-sm font-semibold transition-colors ${category === item.key ? "border-[#DA291C] bg-[#DA291C]/[0.07] text-[#DA291C]" : "border-transparent text-black/65 hover:border-black/20 hover:bg-black/[0.035] hover:text-black"}`}>
          <span>{item.label}</span>{category === item.key && <span className="h-1.5 w-1.5 rounded-full bg-[#DA291C]" />}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:block"><div className="sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto border border-black/10 bg-white p-3"><p className="px-4 pb-3 pt-2 text-xs font-bold uppercase tracking-[0.18em] text-black/45">Kategoriler</p>{categoriesList()}</div></aside>
      <div className="min-w-0">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-center">
          <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex h-12 items-center justify-center gap-2 border border-black/15 bg-white px-4 text-sm font-bold lg:hidden"><Filter className="h-4 w-4" /> Kategoriler</button>
          <label className="flex h-12 flex-1 items-center gap-3 border border-black/15 bg-white px-4 focus-within:border-[#DA291C]"><Search className="h-4 w-4 text-black/45" /><span className="sr-only">Ürün ara</span><input defaultValue={query} onChange={(event) => { const params = new URLSearchParams(searchParams.toString()); const value = event.target.value.trimStart(); if (value) params.set("q", value); else params.delete("q"); router.replace(`${pathname}?${params.toString()}`, { scroll: false }); }} placeholder="Ürün, model veya üretici ara" className="w-full bg-transparent text-sm outline-none placeholder:text-black/40" /></label>
          <p className="whitespace-nowrap text-sm font-semibold text-black/50">{filtered.length} ürün</p>
        </div>
        {filtered.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => (
          <article key={product.id} className="group flex flex-col overflow-hidden border border-black/10 bg-white transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
            <div className="relative aspect-[4/3] overflow-hidden bg-black/[0.025]">{product.primaryImg ? <Image src={product.primaryImg} alt={product.title} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw" className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.035]" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-black/40"><ImageIcon className="h-9 w-9 stroke-[1.25]" /><span className="text-xs font-semibold uppercase tracking-[0.13em]">Ürün Görseli Yakında</span></div>}</div>
            <div className="flex flex-1 flex-col p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#DA291C]">{categoryNames.get(product.category) ?? "Endüstriyel ürün"}</p>{product.manufacturer && <p className="mt-4 text-xs font-semibold uppercase tracking-[0.13em] text-black/45">{product.manufacturer}</p>}<h2 className="mt-2 text-xl font-bold tracking-tight">{product.model || product.title}</h2>{product.model && product.title !== product.model && <p className="mt-1 text-sm font-semibold text-black/55">{product.title}</p>}<p className="mt-3 text-sm font-medium text-black/70">{product.productType}</p><p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-black/55">{product.shortDescription}</p>
              {product.technicalSpecifications.length > 0 && <dl className="mt-5 space-y-2 border-t border-black/10 pt-4">{product.technicalSpecifications.slice(0, 2).map((spec) => <div key={`${spec.group}-${spec.label}`} className="flex justify-between gap-3 text-xs"><dt className="text-black/45">{spec.label}</dt><dd className="text-right font-semibold">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</dd></div>)}</dl>}
              <Link href={`/products/${product.slug}`} className="mt-6 inline-flex items-center justify-between border-t border-black/10 pt-4 text-sm font-bold hover:text-[#DA291C]">Detayları İncele <ArrowUpRight className="h-4 w-4" /></Link></div>
          </article>
        ))}</div> : <div className="mt-8 border border-dashed border-[#B7B7B7] bg-black/[0.02] px-6 py-16 text-center"><h2 className="text-xl font-bold">Eşleşen ürün bulunamadı</h2><p className="mt-2 text-sm text-black/55">Arama ifadenizi veya kategori seçiminizi değiştirin.</p><Link href="/products" className="mt-6 inline-flex bg-black px-5 py-3 text-sm font-bold text-white hover:bg-[#DA291C]">Filtreleri temizle</Link></div>}
      </div>
      {mobileOpen && <div className="fixed inset-0 z-[120] lg:hidden"><button type="button" aria-label="Kategori filtresini kapat" className="absolute inset-0 bg-black/55" onClick={() => setMobileOpen(false)} /><aside role="dialog" aria-modal="true" aria-label="Ürün kategorileri" className="absolute inset-y-0 left-0 w-[min(88vw,360px)] overflow-y-auto bg-white p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between border-b border-black/10 pb-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">Ürün kataloğu</p><h2 className="mt-1 text-xl font-bold">Kategoriler</h2></div><button type="button" onClick={() => setMobileOpen(false)} className="inline-flex h-10 w-10 items-center justify-center border border-black/15" aria-label="Kapat"><X className="h-5 w-5" /></button></div>{categoriesList(true)}</aside></div>}
    </div>
  );
}
