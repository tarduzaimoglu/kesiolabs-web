import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategories,
  getPosts,
  getMediaUrl,
  getCategorySlug,
  getCategoryTitle,
} from "@/lib/strapi";

type Props = {
  params: Promise<{ kategori: string }> | { kategori: string };
};

function formatTR(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.kategori;

  const [categories, posts] = await Promise.all([getCategories(), getPosts()]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const filteredPosts = posts
    .filter((p) => getCategorySlug(p.category) === category.slug)
    .sort((a, b) => ((a.date ?? "") < (b.date ?? "") ? 1 : -1));

  return (
    <main className="min-h-screen w-full bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {category.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {category.description ?? ""}
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          {filteredPosts.map((post) => {
            const img = getMediaUrl(post.coverImage) ?? "/blog/covers/placeholder-1.jpg";
            const catTitle = getCategoryTitle(post.category) ?? category.title;

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative w-full overflow-hidden bg-slate-100">
                  <div className="aspect-[16/9] w-full">
                    <img
                      src={img}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <time className="text-xs text-slate-500">
                      {formatTR(post.date ?? "")}
                    </time>
                    <span className="text-xs font-medium text-blue-600">
                      {catTitle}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-semibold text-slate-900 leading-snug">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
