import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ImageIcon } from "lucide-react";
import { getCatalogCategories, getCatalogProductBySlug, getCatalogProducts, type TechnicalSpecification } from "@/lib/strapi";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const product = await getCatalogProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return { title: product.title, description: product.shortDescription || `${product.title} ürün detayları.`, alternates: { canonical: `/products/${slug}` }, openGraph: { title: product.title, description: product.shortDescription || "Kesiolabs endüstriyel ürün kataloğu", images: product.primaryImg ? [product.primaryImg] : [] } };
}

function SpecificationTable({ specifications }: { specifications: TechnicalSpecification[] }) {
  const groups = specifications.reduce<Record<string, TechnicalSpecification[]>>((result, spec) => { const key = spec.group || "Teknik Özellikler"; (result[key] ??= []).push(spec); return result; }, {});
  return <div className="divide-y divide-black/10 border border-black/10">{Object.entries(groups).map(([group, items]) => <section key={group}><h3 className="bg-black px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white">{group}</h3><dl>{items.map((spec) => <div key={`${group}-${spec.label}`} className="grid gap-1 border-t border-black/[0.07] px-5 py-4 first:border-t-0 sm:grid-cols-[minmax(160px,0.8fr)_1.2fr] sm:gap-6"><dt className="text-sm font-semibold text-black/55">{spec.label}</dt><dd className="text-sm font-semibold">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</dd></div>)}</dl></section>)}</div>;
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, categories, allProducts] = await Promise.all([getCatalogProductBySlug(slug), getCatalogCategories(), getCatalogProducts()]);
  if (!product) notFound();
  const category = categories.find((item) => item.key === product.category);
  const related = allProducts.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 3);
  const standardEquipment = product.equipment.filter((item) => item.type === "STANDARD");
  const optionalEquipment = product.equipment.filter((item) => item.type === "OPTIONAL");

  return <main className="min-h-screen bg-white text-black">
    <div className="border-b border-black/10 bg-black/[0.018]"><nav aria-label="Sayfa yolu" className="mx-auto flex max-w-7xl items-center gap-2 px-6 py-4 text-xs font-semibold text-black/50"><Link href="/products" className="hover:text-[#DA291C]">Ürünler</Link><span>/</span>{category && <><Link href={`/products?category=${category.key}`} className="hover:text-[#DA291C]">{category.label}</Link><span>/</span></>}<span className="text-black">{product.model || product.title}</span></nav></div>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
      <div className="relative aspect-[4/3] border border-black/10 bg-black/[0.025]">{product.primaryImg ? <Image src={product.primaryImg} alt={product.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8" priority /> : <div className="flex h-full flex-col items-center justify-center gap-4 text-black/40"><ImageIcon className="h-14 w-14 stroke-1" /><span className="text-sm font-bold uppercase tracking-[0.16em]">Ürün Görseli Yakında</span></div>}</div>
      <article className="self-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">{category?.label ?? "Endüstriyel ürün"}</p>{product.manufacturer && <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-black/45">{product.manufacturer}</p>}<h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] md:text-6xl">{product.model || product.title}</h1>{product.model && product.title !== product.model && <p className="mt-3 text-xl font-semibold text-black/60">{product.title}</p>}<p className="mt-5 text-base font-bold text-black/75">{product.productType}</p><p className="mt-6 text-lg leading-8 text-black/60">{product.shortDescription}</p>
        {product.technicalSpecifications.length > 0 && <dl className="mt-8 grid grid-cols-2 gap-px border border-black/10 bg-black/10">{product.technicalSpecifications.slice(0, 4).map((spec) => <div key={`${spec.group}-${spec.label}`} className="bg-white p-4"><dt className="text-xs font-semibold text-black/45">{spec.label}</dt><dd className="mt-1 text-sm font-bold">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</dd></div>)}</dl>}
        <div className="mt-9 flex flex-wrap gap-3"><Link href="/contact" className="inline-flex items-center gap-2 bg-[#DA291C] px-6 py-3.5 text-sm font-bold text-white hover:bg-black">Bilgi / Teklif Alın <ArrowRight className="h-4 w-4" /></Link><Link href="/quote" className="inline-flex border border-black/20 px-6 py-3.5 text-sm font-bold hover:border-black hover:bg-black hover:text-white">Teklif sayfası</Link></div>
      </article>
    </section>
    <div className="border-t border-black/10"><div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
      {product.description && <section><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">Ürün hakkında</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Detaylı Açıklama</h2><div className="mt-6 whitespace-pre-wrap text-base leading-8 text-black/65">{product.description}</div></section>}
      {product.features.length > 0 && <section><h2 className="text-3xl font-bold tracking-tight">Öne Çıkan Özellikler</h2><ul className="mt-6 grid gap-3 md:grid-cols-2">{product.features.map((item) => <li key={item.text} className="flex gap-3 border border-black/10 p-4 text-sm leading-6"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#DA291C]" />{item.text}</li>)}</ul></section>}
      {product.applications.length > 0 && <section><h2 className="text-3xl font-bold tracking-tight">Uygulama Alanları</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{product.applications.map((item) => <div key={item.text} className="border-l-2 border-[#DA291C] bg-black/[0.025] px-5 py-4 text-sm font-semibold leading-6">{item.text}</div>)}</div></section>}
      {product.technicalSpecifications.length > 0 && <section><h2 className="mb-6 text-3xl font-bold tracking-tight">Teknik Özellikler</h2><SpecificationTable specifications={product.technicalSpecifications} /></section>}
      {(standardEquipment.length > 0 || optionalEquipment.length > 0) && <section><h2 className="text-3xl font-bold tracking-tight">Donanım ve Aksesuarlar</h2><div className="mt-6 grid gap-8 md:grid-cols-2">{standardEquipment.length > 0 && <div><h3 className="border-b-2 border-black pb-3 text-sm font-bold uppercase tracking-[0.14em]">Standart Donanım</h3><ul className="mt-4 space-y-3">{standardEquipment.map((item) => <li key={item.name} className="text-sm leading-6"><strong>{item.name}</strong>{item.description && <span className="block text-black/55">{item.description}</span>}</li>)}</ul></div>}{optionalEquipment.length > 0 && <div><h3 className="border-b-2 border-[#DA291C] pb-3 text-sm font-bold uppercase tracking-[0.14em]">Opsiyonel Aksesuarlar</h3><ul className="mt-4 space-y-3">{optionalEquipment.map((item) => <li key={item.name} className="text-sm leading-6"><strong>{item.name}</strong>{item.description && <span className="block text-black/55">{item.description}</span>}</li>)}</ul></div>}</div></section>}
      {product.variants.length > 0 && <section><h2 className="text-3xl font-bold tracking-tight">Konfigürasyonlar</h2><div className="mt-6 space-y-6">{product.variants.map((variant) => <article key={variant.name} className="border border-black/10 p-6"><h3 className="text-xl font-bold">{variant.name}</h3>{variant.description && <p className="mt-2 text-sm leading-6 text-black/60">{variant.description}</p>}{variant.specifications.length > 0 && <div className="mt-5"><SpecificationTable specifications={variant.specifications} /></div>}{variant.equipment.length > 0 && <ul className="mt-5 grid gap-2 sm:grid-cols-2">{variant.equipment.map((item) => <li key={`${item.type}-${item.name}`} className="text-sm"><span className="mr-2 text-xs font-bold text-[#DA291C]">{item.type === "STANDARD" ? "STANDART" : "OPSİYONEL"}</span>{item.name}</li>)}</ul>}</article>)}</div></section>}
    </div></div>
    {related.length > 0 && <section className="border-t border-black/10 bg-black/[0.025]"><div className="mx-auto max-w-7xl px-6 py-16"><h2 className="text-3xl font-bold tracking-tight">İlgili Ürünler</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={`/products/${item.slug}`} className="group flex items-center justify-between border border-black/10 bg-white p-5 font-bold hover:border-[#DA291C] hover:text-[#DA291C]"><span><span className="block text-xs font-semibold text-black/45">{item.productType}</span><span className="mt-1 block">{item.model || item.title}</span></span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>)}</div></div></section>}
  </main>;
}
