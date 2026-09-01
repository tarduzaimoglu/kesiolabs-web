"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { CatalogCategory } from "@/lib/strapi";

type CatalogProduct = {
  id: string; title: string; slug: string; category: string; shortDescription?: string;
  primaryImg?: string; bullets?: string[];
};

export default function ProductsClient({ products, categories, initialCategory = "all" }: { products: CatalogProduct[]; categories: CatalogCategory[]; initialCategory?: string }) {
  const [category, setCategory] = useState(categories.some((item) => item.key === initialCategory) ? initialCategory : "all");
  const [query, setQuery] = useState("");
  const categoryNames = new Map(categories.map((item) => [item.key, item.label]));
  const filtered = useMemo(() => products.filter((product) => {
    const categoryMatch = category === "all" || product.category === category;
    const searchMatch = `${product.title} ${product.shortDescription}`.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr").trim());
    return categoryMatch && searchMatch;
  }), [products, category, query]);

  return (
    <>
      <div className="grid gap-5 border-y border-black/10 py-6 lg:grid-cols-[1fr_320px] lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ürün kategorileri">
          <button onClick={() => setCategory("all")} className={`border px-4 py-2 text-sm font-bold ${category === "all" ? "border-[#DA291C] bg-[#DA291C] text-white" : "border-black/15 bg-white hover:border-black"}`}>Tümü</button>
          {categories.map((item) => <button key={item.key} onClick={() => setCategory(item.key)} className={`border px-4 py-2 text-sm font-bold ${category === item.key ? "border-[#DA291C] bg-[#DA291C] text-white" : "border-black/15 bg-white hover:border-black"}`}>{item.label}</button>)}
        </div>
        <label className="flex h-12 items-center gap-3 border border-black/15 bg-white px-4 focus-within:border-[#DA291C]"><Search className="h-4 w-4 text-black/50" /><span className="sr-only">Ürün ara</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ürün ara" className="w-full bg-transparent text-sm outline-none placeholder:text-black/40" /></label>
      </div>

      {filtered.length ? <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => (
        <article key={product.id} className="group flex flex-col overflow-hidden border border-black/10 bg-white transition-transform hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
          <div className="aspect-[4/3] overflow-hidden bg-black/[0.035]">{product.primaryImg ? <img src={product.primaryImg} alt={product.title} className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center text-sm text-black/45">Görsel eklenmedi</div>}</div>
          <div className="flex flex-1 flex-col p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#DA291C]">{categoryNames.get(product.category) ?? "Ürün"}</p><h2 className="mt-3 text-xl font-bold tracking-tight">{product.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-black/60">{product.shortDescription || product.bullets?.[0] || "Ürün detayları için inceleyin."}</p><Link href={`/products/${product.slug}`} className="mt-6 inline-flex items-center justify-between border-t border-black/10 pt-4 text-sm font-bold hover:text-[#DA291C]">Detayları incele <ArrowUpRight className="h-4 w-4" /></Link></div>
        </article>
      ))}</div> : <div className="mt-10 border border-dashed border-[#B7B7B7] bg-black/[0.02] px-6 py-16 text-center"><h2 className="text-xl font-bold">Eşleşen ürün bulunamadı</h2><p className="mt-2 text-sm text-black/55">Arama ifadenizi veya kategori seçiminizi değiştirin.</p></div>}
    </>
  );
}
