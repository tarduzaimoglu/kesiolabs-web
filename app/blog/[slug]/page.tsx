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

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

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

/**
 * Mini-Markdown -> HTML
 * - Başlıklar: #, ##, ### ... (satır başında)
 * - Bold: **text**
 * - Italic: _text_ veya *text*
 * - Strike: ~~text~~
 * - Satır sonları: \n -> <br/>
 * - Indent/boşluklar: white-space pre-wrap ile korunacak
 */
function miniMarkdownToHtml(input: string) {
  const esc = (str: string) =>
    str
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const lines = input.replace(/\r\n/g, "\n").split("\n");

  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine; // indent'i korumak istiyoruz
    const trimmed = line.trim();

    // boş satır
    if (!trimmed) {
      out.push(`<br/>`);
      continue;
    }

    // headings (satır başında # ile)
    const m = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      let text = esc(m[2]);

      // inline formatlar
      text = text
        .replace(/~~(.+?)~~/g, "<del>$1</del>")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>")
        .replace(/(^|[^_])_(?!\s)(.+?)(?<!\s)_(?!_)/g, "$1<em>$2</em>");

      out.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // normal satır (indent dahil)
    let text = esc(line);

    text = text
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/(^|[^_])_(?!\s)(.+?)(?<!\s)_(?!_)/g, "$1<em>$2</em>")
      // underline için basit destek (sen <u> yazıyorsun): &lt;u&gt; metni kalmasın diye gerçek u yapalım
      .replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g, "<u>$1</u>");

    out.push(`<div>${text}</div>`);
  }

  return out.join("\n");
}

function sanitizeRichHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "del",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "code",
      "pre",
      "hr",
      "img",
      "span",
      "div",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      span: ["style"],
      div: ["style"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      h5: ["style"],
      h6: ["style"],
    },
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const categorySlug = getCategorySlug(post.category) ?? "";
  const categoryTitle = getCategoryTitle(post.category) ?? "";

  const allPosts = await getPosts();

  const sameCategory = allPosts
    .filter(
      (p) => p.slug !== post.slug && getCategorySlug(p.category) === categorySlug
    )
    .sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));

  const fallback = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => ((a.date || "") < (b.date || "") ? 1 : -1));

  const related = uniqueBySlug([...sameCategory, ...fallback]).slice(0, 3);

  const blocks = normalizeBlocks((post as any).contentBlocks);

  const richTextRaw =
    typeof (post as any).contentBlocks === "string"
      ? ((post as any).contentBlocks as string)
      : "";

  // HTML geliyorsa direkt sanitize+render
  // HTML değilse (senin yazdığın gibi #, ** vs) mini-markdown -> HTML çevir
  const richTextPrepared = richTextRaw
    ? isProbablyHtml(richTextRaw)
      ? richTextRaw
      : miniMarkdownToHtml(richTextRaw)
    : "";

  const safeHtml = richTextPrepared ? sanitizeRichHtml(richTextPrepared) : "";

const fallbackParagraphs = (post.contentBlocks || "")
  .toString()
  .split("\n\n")
  .map((t) => t.trim())
  .filter(Boolean);
  
  const heroImg =
    getMediaUrl(post.coverImage) ?? "/blog/covers/placeholder-1.jpg";

  return (
    <main className="min-h-screen w-full bg-white">
      <article className="mx-auto w-full max-w-3xl px-6 py-10">
        <nav className="text-[11px] text-slate-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="px-1">/</span>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>

          {categorySlug ? (
            <>
              <span className="px-1">/</span>
              <Link
                href={`/blog/kategori/${categorySlug}`}
                className="hover:underline"
              >
                {categoryTitle || categorySlug}
              </Link>
            </>
          ) : null}
        </nav>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {post.title}
        </h1>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
          <time>{post.date ? formatTR(post.date) : ""}</time>
          {categorySlug ? <span>•</span> : null}
          {categorySlug ? (
            <Link
              href={`/blog/kategori/${categorySlug}`}
              className="text-blue-600 hover:underline"
            >
              {categoryTitle || categorySlug}
            </Link>
          ) : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-tl-[192px] rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px] bg-slate-100">
          <div className="aspect-[16/9] w-full">
            <img
              src={heroImg}
              alt={post.title}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Content */}
        <section
  className="
    mt-6 max-w-none break-words [overflow-wrap:anywhere]
    prose prose-slate
    [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:mt-6 [&_h1]:mb-3
    [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
    [&_h3]:text-xl  [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
    [&_h4]:text-lg  [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2
    [&_p]:text-[13px] [&_p]:leading-7
    [&_ul]:my-4 [&_ol]:my-4
  "
>
          {safeHtml ? (
            // ✅ boşluk/indent ve satır sonlarını koru
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          ) : blocks.length ? (
            <StrapiBlocks blocks={blocks} />
          ) : fallbackParagraphs.length ? (
            fallbackParagraphs.map((p, i) => (
              <p
                key={i}
                className="text-[13px] leading-7 text-slate-700 mt-4 whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-[13px] leading-7 text-slate-700 mt-4">
              (Bu yazının içeriği yakında eklenecek.)
            </p>
          )}
        </section>

        <div className="mt-10 h-px w-full bg-blue-200" />

        <section className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Daha Fazlası</h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((p) => {
              const img =
                getMediaUrl(p.coverImage) ?? "/blog/covers/placeholder-1.jpg";

              return (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <img
                      src={img}
                      alt={p.title}
                      className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                      draggable={false}
                    />
                  </div>

                  <div className="p-3">
                    <h4 className="text-[12px] font-semibold leading-snug text-slate-900 line-clamp-2">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </article>
    </main>
  );
}
