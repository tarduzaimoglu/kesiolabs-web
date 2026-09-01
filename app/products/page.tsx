import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { getCatalogCategories, getCatalogProducts } from "@/lib/strapi";

export const metadata: Metadata = { title: "Ürünler", description: "Kesiolabs endüstriyel ürün ve teknik ekipman kataloğu.", alternates: { canonical: "/products" } };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
  return <main className="min-h-screen bg-white"><section className="border-b border-black/10 bg-black px-6 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DA291C]">Kesiolabs ürün kataloğu</p><h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-[-0.04em] md:text-6xl">Endüstriyel ihtiyaçlarınız için doğru teknolojiyi bulun.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#B7B7B7]">Teknik ekipmanları kategori, model ve uygulama alanına göre inceleyin.</p></div></section><section className="mx-auto max-w-7xl px-6 py-12"><Suspense fallback={<div className="py-16 text-center text-sm text-black/50">Ürünler hazırlanıyor…</div>}><ProductsClient products={products} categories={categories} /></Suspense></section></main>;
}
