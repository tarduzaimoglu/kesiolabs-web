import Link from "next/link";
import Image from "next/image"; // Next.js Image optimizasyonu için eklendi
import {
  getCategories,
  getPosts,
  getMediaUrl,
  getCategoryTitle,
} from "@/lib/strapi";
import { ArrowUpRight, FolderOpen } from "lucide-react"; // UI için modern ikonlar

function FeaturedCard({
  href,
  title,
  excerpt,
  tag,
  image,
}: {
  href: string;
  title: string;
  excerpt: string;
  tag: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group block w-full overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-500 hover:bg-white/[0.05] hover:border-indigo-500/30 hover:-translate-y-2"
    >
      <div className="relative h-[280px] md:h-[340px] w-full overflow-hidden bg-[#0b1120]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
        {/* Görsel üzerine şık bir karartma ve Kategori Tag'i */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-90" />
        <div className="absolute top-6 left-6 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md uppercase tracking-wider">
          {tag}
        </div>
      </div>

      <div className="relative p-8 pt-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          {/* Modern Ok İkonu */}
          <div className="shrink-0 p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-500 transition-all">
            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </div>
        </div>

        <p className="mt-4 text-[15px] leading-relaxed text-slate-400 line-clamp-3">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}

function CategoryCard({
  title,
  desc,
  href,
  images,
}: {
  title: string;
  desc: string;
  href: string;
  images: [string, string, string, string];
}) {
  return (
    <Link
      href={href}
      className="group block w-full overflow-hidden rounded-3xl bg-[#0b1120] border border-white/10 shadow-xl transition-all duration-500 hover:border-indigo-500/30 hover:shadow-indigo-500/10"
    >
      <div className="grid grid-cols-2 gap-1 p-2 bg-white/[0.02]">
        {/* 4'lü Görsel Grid (Kategori İçeriğini Yansıtır) */}
        {images.map((img, i) => (
          <div key={i} className={`relative h-[120px] md:h-[150px] w-full overflow-hidden ${i === 0 ? 'rounded-tl-2xl' : ''} ${i === 1 ? 'rounded-tr-2xl' : ''}`}>
            <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors" />
          </div>
        ))}
      </div>

      <div className="p-8">
        <div className="flex items-center gap-3 mb-3">
          <FolderOpen className="w-5 h-5 text-indigo-400" />
          <h4 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h4>
        </div>
        <p className="text-[14px] leading-relaxed text-slate-400 line-clamp-2">{desc}</p>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);

  const featured = [...posts]
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1))
    .slice(0, 2);

  return (
    <main className="relative min-h-screen bg-[#0b1120] font-sans overflow-hidden">
      {/* GENEL ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[url('/blog-bg.png')] bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1120]/80 to-[#0b1120] pointer-events-none" />

      {/* ÜST BÖLÜM: ÖNE ÇIKAN YAZILAR */}
      <section className="relative z-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              Blog<span className="text-indigo-400">Labs</span>
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl">
              3D baskı teknolojileri, malzeme bilimi ve endüstriyel tasarıma dair en güncel içgörüler.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {featured.map((p) => {
              const tag = getCategoryTitle(p.category) ?? "Makale";
              const img = getMediaUrl(p.coverImage) ?? "/blog/covers/placeholder-1.jpg";

              return (
                <FeaturedCard
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  title={p.title}
                  excerpt={p.excerpt ?? ""}
                  tag={tag}
                  image={img}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ALT BÖLÜM: KATEGORİLER (Bembeyaz bölüm kaldırıldı, temaya uyduruldu) */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest text-center">
              Kategoriler
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const imgs = posts
                .filter((p) => {
                  const slug = p.category?.slug ?? p.category?.data?.attributes?.slug;
                  return slug === c.slug;
                })
                .slice(0, 4)
                .map((p) => getMediaUrl(p.coverImage))
                .filter(Boolean) as string[];

              const filledImages = [
                imgs[0] ?? "/blog/covers/placeholder-1.jpg",
                imgs[1] ?? "/blog/covers/placeholder-2.jpg",
                imgs[2] ?? "/blog/covers/placeholder-3.jpg",
                imgs[3] ?? "/blog/covers/placeholder-4.jpg",
              ] as [string, string, string, string];

              return (
                <CategoryCard
                  key={c.slug}
                  title={c.title}
                  desc={c.description ?? ""}
                  href={`/blog/kategori/${c.slug}`}
                  images={filledImages}
                />
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
