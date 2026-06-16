import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getPosts,
  getMediaUrl,
  getCategorySlug,
  getCategoryTitle,
} from "@/lib/strapi";
import { StrapiBlocks } from "@/components/StrapiBlocks";
import sanitizeHtml from "sanitize-html";
import { ChevronRight, Calendar, ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

// --- YARDIMCI FONKSİYONLAR (DOKUNULMADI) ---
function formatTR(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function uniqueBySlug<T extends { slug: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function normalizeBlocks(contentBlocks: any) {
  if (typeof contentBlocks === "string") {
    try {
      const parsed = JSON.parse(contentBlocks);
      return normalizeBlocks(parsed);
    } catch {
      return [];
    }
  }
  if (Array.isArray(contentBlocks)) return contentBlocks;
  if (Array.isArray(contentBlocks?.blocks)) return contentBlocks.blocks;
  if (Array.isArray(contentBlocks?.children)) return contentBlocks.children;
  if (Array.isArray(contentBlocks?.data)) return contentBlocks.data;
  return [];
}

function isProbablyHtml(s: string) {
  return /^\s*</.test(s);
}

function miniMarkdownToHtml(input: string) {
  const esc = (str: string) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine;
    const trimmed = line.trim();

    if (!trimmed) {
      out.push(`<br/>`);
      continue;
    }

    const m = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      let text = esc(m[2]);

      text = text
        .replace(/~~(.+?)~~/g, "<del>$1</del>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>")
        .replace(/(^|[^_])_(?!\s)(.+?)(?<!\s)_(?!_)/g, "$1<em>$2</em>");

      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    let text = esc(line);

    text = text
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/(^|[^_])_(?!\s)(.+?)(?<!\s)_(?!_)/g, "$1<em>$2</em>")
      .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, "<u>$1</u>");

    out.push(`<div>${text}</div>`);
  }

  return out.join("\n");
}

function sanitizeRichHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "del",
      "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
      "blockquote", "a", "code", "pre", "hr", "img", "span", "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"],
      div: ["style"],
      p: ["style", "class"], // p etiketine class ekleme izni
      h1: ["style"], h2: ["style"], h3: ["style"],
      h4: ["style"], h5: ["style"], h6: ["style"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}

// --- SAYFA RENDER FONKSİYONU ---
export default async function BlogDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categorySlug = getCategorySlug(post.category) ?? "";
  const categoryTitle = getCategoryTitle(post.category) ?? "";
  const allPosts = await getPosts();

  const sameCategory = allPosts
    .filter((p) => p.slug !== post.slug && getCategorySlug(p.category) === categorySlug)
    .sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));

  const fallback = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));

  const related = uniqueBySlug([...sameCategory, ...fallback]).slice(0, 3);
  const blocks = normalizeBlocks((post as any).contentBlocks);

  const richTextRaw = typeof (post as any).contentBlocks === "string" ? ((post as any).contentBlocks as string) : "";
  const richTextPrepared = richTextRaw ? (isProbablyHtml(richTextRaw) ? richTextRaw : miniMarkdownToHtml(richTextRaw)) : "";
  const safeHtml = richTextPrepared ? sanitizeRichHtml(richTextPrepared) : "";

  const fallbackParagraphs: string[] = String((post as any).contentBlocks ?? "")
    .split("\n\n")
    .map((t: string) => t.trim())
    .filter(Boolean);

  const heroImg = getMediaUrl(post.coverImage) ?? "/blog/covers/placeholder-1.jpg";

  return (
    <main className="min-h-screen w-full bg-[#0b1120] font-sans selection:bg-indigo-500/30">
      
      <article className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-8 md:py-12">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-slate-400 mb-6 w-fit px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/10 bg-white/5">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          {categorySlug && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/blog/kategori/${categorySlug}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                {categoryTitle || categorySlug}
              </Link>
            </>
          )}
        </nav>

        {/* BAŞLIK VE TARİH */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-400">
            <Calendar className="w-4 h-4" />
            <time>{post.date ? formatTR(post.date) : ""}</time>
          </div>
        </div>

        {/* KAPAK GÖRSELİ (Başlıktan ayrı, temiz bir şekilde) */}
        <div className="w-full aspect-video md:aspect-[21/9] bg-black/20 rounded-2xl sm:rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl relative">
            <img src={heroImg} alt={post.title} className="w-full h-full object-cover" draggable={false} />
            {/* Hafif bir ışık efekti */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/40 to-transparent pointer-events-none" />
        </div>

        {/* İÇERİK (OKUMA) ALANI */}
        <section
          className="
            max-w-none break-words [overflow-wrap:anywhere]
            prose prose-invert prose-slate
            [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-10 [&_h1]:mb-5
            [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-200 [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:text-[15px] sm:[&_p]:text-[17px] [&_p]:leading-relaxed [&_p]:text-slate-300 [&_p]:mb-6
            [&_div]:text-[15px] sm:[&_div]:text-[17px] [&_div]:leading-relaxed [&_div]:text-slate-300 [&_div]:mb-6
            [&_a]:text-indigo-400 [&_a]:underline hover:[&_a]:text-indigo-300 [&_a]:transition-colors
            [&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:text-slate-300
            [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_li]:text-slate-300
            [&_strong]:text-white [&_strong]:font-semibold
            [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:bg-white/[0.02] [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg
            [&_img]:rounded-2xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-xl
          "
        >
          {safeHtml ? (
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          ) : blocks.length ? (
            <StrapiBlocks blocks={blocks} />
          ) : fallbackParagraphs.length ? (
            <>
              {fallbackParagraphs.map((p: string, i: number) => (
                <p key={i} className="whitespace-pre-wrap text-slate-300">
                  {p}
                </p>
              ))}
            </>
          ) : (
            <p className="italic text-slate-500 border border-white/10 p-6 rounded-xl bg-white/[0.02] text-center">
              Bu yazının içeriği yakında eklenecek.
            </p>
          )}
        </section>

        {/* YAZI BİTİŞİ & GÜZEL AYIRICI BANT */}
        <div className="mt-16 mb-12 flex items-center justify-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-2 h-2 rounded-full bg-indigo-500/50" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
        </div>

        {/* İLGİNİZİ ÇEKEBİLİR (Daha Fazlası) BÖLÜMÜ */}
        <section className="pb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">İlginizi Çekebilir</h3>

          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
            {related.map((p) => {
              const img = getMediaUrl(p.coverImage) ?? "/blog/covers/placeholder-1.jpg";

              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1 hover:border-indigo-500/30"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black/20">
                    <img
                      src={img}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      draggable={false}
                    />
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <h4 className="text-[13px] sm:text-[14px] font-semibold leading-relaxed text-slate-200 line-clamp-3 group-hover:text-indigo-400 transition-colors">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-medium text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Tüm Yazılara Dön
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
