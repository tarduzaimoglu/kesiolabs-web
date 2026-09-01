import type { Metadata } from "next";
import ProductsClient from "./ProductsClient";
import { getCatalogCategories, getCatalogProducts } from "@/lib/strapi";

export const metadata: Metadata = { title: "Ürünler", description: "Kesiolabs ürün ve dijital üretim çözümleri kataloğu.", alternates: { canonical: "/products" } };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getCatalogProducts(), getCatalogCategories()]);
  return <main className="min-h-screen bg-white"><section className="border-b border-black/10 bg-black px-6 py-20 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DA291C]">Kesiolabs ürün kataloğu</p><h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-[-0.04em] md:text-6xl">Üretim ihtiyaçları için doğru çözümü bulun.</h1><p className="mt-6 max-w-2xl text-base leading-7 text-[#B7B7B7]">Kategorileri inceleyin, teknik ihtiyaçlarınıza uygun ürün detaylarına ulaşın.</p></div></section><section className="mx-auto max-w-7xl px-6 py-12"><ProductsClient products={products} categories={categories} initialCategory={params.category} /></section></main>;
}
