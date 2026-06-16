import Link from "next/link";
import {
  getCategories,
  getPosts,
  getMediaUrl,
  getCategoryTitle,
} from "@/lib/strapi";
import { ArrowUpRight, ArrowLeft, FolderOpen } from "lucide-react";

// ANA BLOG SAYFASINDAKİ AYNI MODERN KART TASARIMI
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
      <div className="relative h-[240px] md:h-[280px] w-full overflow-hidden bg-[#0b1120]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
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

// SAYFA RENDER FONKSİYONU
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Verileri paralel olarak çekiyoruz
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);

  // URL'den gelen slug'a göre mevcut kategoriyi bul
  const currentCategory = categories.find((c) => c.slug === params.slug);

  // Bu kategoriye ait olan postları filtrele ve tarihe göre sırala
  const categoryPosts = posts
    .filter((p) => {
      const postCatSlug = p.category?.slug ?? p.category?.data?.attributes?.slug;
      return postCatSlug === params.slug;
    })
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));

  // Eğer URL yanlış yazılmışsa veya kategori yoksa 404/Boş durum göster
  if (!currentCategory) {
    return (
      <main className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Kategori Bulunamadı</h1>
          <Link href="/blog" className="text-indigo-400 hover:text-white transition-colors">
            ← Blog'a Dön
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#0b1120] font-sans overflow-hidden">
      {/* GENEL ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1120]/80 to-[#0b1120] pointer-events-none" />

      {/* ÜST BÖLÜM: KATEGORİ BAŞLIĞI */}
      <section className="relative z-10 pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8 bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Tüm Yazılara Dön
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <FolderOpen className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              {currentCategory.title}
            </h1>
          </div>
          
          {currentCategory.description && (
            <p className="text-lg text-slate-400 max-w-2xl mt-4 leading-relaxed">
              {currentCategory.description}
            </p>
          )}
        </div>
      </section>

      {/* ALT BÖLÜM: KATEGORİ YAZILARI (GRID) */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {categoryPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {categoryPosts.map((p) => {
                const tag = getCategoryTitle(p.category) ?? currentCategory.title;
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
          ) : (
            <div className="py-20 text-center border border-white/10 bg-white/[0.02] rounded-3xl backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-slate-300">Bu kategoride henüz yazı bulunmuyor.</h2>
              <p className="text-slate-500 mt-2">Çok yakında yeni içeriklerle karşınızda olacağız.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
