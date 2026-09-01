import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getCatalogCategories, getCatalogProductBySlug } from "@/lib/strapi";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const product = await getCatalogProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return { title: product.title, description: product.shortDescription || `${product.title} ürün detayları.`, alternates: { canonical: `/products/${slug}` }, openGraph: { title: product.title, description: product.shortDescription || "Kesiolabs ürün kataloğu", images: product.primaryImg ? [product.primaryImg] : [] } };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const [product, categories] = await Promise.all([getCatalogProductBySlug(slug), getCatalogCategories()]); if (!product) notFound();
  const category = categories.find((item) => item.key === product.category);
  return <main className="min-h-screen bg-white"><div className="mx-auto max-w-7xl px-6 py-10"><Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#DA291C]"><ArrowLeft className="h-4 w-4" />Ürünlere dön</Link><div className="mt-10 grid gap-12 lg:grid-cols-2"><div className="aspect-square border border-black/10 bg-black/[0.025] p-8">{product.primaryImg ? <img src={product.primaryImg} alt={product.title} className="h-full w-full object-contain" /> : <div className="flex h-full items-center justify-center text-black/45">Görsel eklenmedi</div>}</div><article className="py-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">{category?.label ?? "Ürün"}</p><h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] md:text-5xl">{product.title}</h1>{product.shortDescription && <p className="mt-6 text-lg leading-8 text-black/65">{product.shortDescription}</p>}{product.description && <div className="mt-8 whitespace-pre-wrap border-t border-black/10 pt-8 leading-7 text-black/70">{product.description}</div>}{product.bullets?.length > 0 && <ul className="mt-8 space-y-3">{product.bullets.map((item: string) => <li key={item} className="flex gap-3 text-sm leading-6"><Check className="mt-1 h-4 w-4 shrink-0 text-[#DA291C]" />{item}</li>)}</ul>}<Link href="/contact" className="mt-10 inline-flex bg-[#DA291C] px-6 py-3 text-sm font-bold text-white hover:bg-black">Bilgi alın</Link></article></div></div></main>;
}
