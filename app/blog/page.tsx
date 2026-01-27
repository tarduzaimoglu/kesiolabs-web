import Link from "next/link";
import {
  getCategories,
  getPosts,
  getMediaUrl,
  getCategoryTitle,
} from "@/lib/strapi";

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
      className="
        group block w-full max-w-[686px] overflow-hidden
        rounded-[5px] md:rounded-[9px]
        bg-white shadow-[0_30px_90px_rgba(0,0,0,0.35)]
      "
    >
      <div className="h-[398px] w-full overflow-hidden rounded-t-[5px] md:rounded-t-[9px] bg-slate-200">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      <div className="h-[257px] w-full rounded-b-[5px] md:rounded-b-[9px] bg-white px-8 py-7">
        <div className="flex items-start justify-between gap-6">
          <h3 className="text-[18px] font-semibold text-slate-900 leading-snug">
            {title}
          </h3>
          <span className="text-[12px] font-medium text-blue-600">{tag}</span>
        </div>

        <p className="mt-4 text-[14px] leading-6 text-slate-700">{excerpt}</p>
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
      className="
        block w-full max-w-[686px] overflow-hidden
        rounded-[5px] md:rounded-[9px]
        bg-white shadow-[0_20px_70px_rgba(0,0,0,0.18)]
      "
    >
      <div className="grid grid-cols-2">
        <div className="h-[199px] w-full overflow-hidden bg-slate-200 rounded-tl-[5px] md:rounded-tl-[9px]">
          <img src={images[0]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="h-[199px] w-full overflow-hidden bg-slate-200 rounded-tr-[5px] md:rounded-tr-[9px]">
          <img src={images[1]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="h-[199px] w-full overflow-hidden bg-slate-200">
          <img src={images[2]} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="h-[199px] w-full overflow-hidden bg-slate-200">
          <img src={images[3]} alt="" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="px-8 py-7">
        <h4 className="text-[18px] font-semibold text-slate-900">{title}</h4>
        <p className="mt-3 text-[14px] leading-6 text-slate-700">{desc}</p>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);

  // ✅ burada ; yok — zincir devam ediyor
  const featured = [...posts]
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1))
    .slice(0, 2);

  return (
    <main className="relative isolate min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/blog-bg.png')" }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pt-14 pb-24">
          <h1 className="text-3xl font-semibold text-white">BlogLabs</h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {featured.map((p) => {
              const tag = getCategoryTitle(p.category) ?? "";
              const img =
                getMediaUrl(p.coverImage) ?? "/blog/covers/placeholder-1.jpg";

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

      <section className="relative bg-white rounded-tl-[96px] md:rounded-tl-[192px]">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-20">
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {categories.map((c) => {
              const imgs = posts
                .filter((p) => {
                  const slug =
                    p.category?.slug ?? p.category?.data?.attributes?.slug;
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
