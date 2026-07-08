import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPageBySlug } from "@/lib/strapi";

export default async function StaticPage({
  slug,
  fallbackTitle,
}: {
  slug: string;
  fallbackTitle: string;
}) {
  const page = await getPageBySlug(slug);
  if (!page) return notFound();

  const title = page.heroTitle || page.title || fallbackTitle;
  const subtitle = page.heroSubtitle || "";
  const body = page.body || "";

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-[900px] px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold text-center">
          {title}
        </h1>

        {subtitle ? (
          <p className="mt-3 text-sm md:text-base text-center opacity-70 whitespace-pre-line">
            {subtitle}
          </p>
        ) : null}

        {/* Eğer Tailwind Typography plugin yoksa bile markdown düzgün çalışır */}
        <article className="mt-10 text-[15px] md:text-[16px] leading-7 text-slate-900">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h2 className="mt-10 mb-3 text-2xl md:text-3xl font-semibold tracking-tight">
          {children}
        </h2>
      ),
      h2: ({ children }) => (
        <h3 className="mt-8 mb-3 text-xl md:text-2xl font-semibold tracking-tight">
          {children}
        </h3>
      ),
      h3: ({ children }) => (
        <h4 className="mt-6 mb-2 text-lg md:text-xl font-semibold tracking-tight">
          {children}
        </h4>
      ),
      p: ({ children }) => <p className="my-3">{children}</p>,
      ul: ({ children }) => (
        <ul className="my-4 ml-5 list-disc space-y-1">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="my-4 ml-5 list-decimal space-y-1">{children}</ol>
      ),
      li: ({ children }) => <li className="pl-1">{children}</li>,
      a: ({ children, href }) => (
        <a
          href={href}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-5 border-l-4 pl-4 italic opacity-90">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-8" />,
    }}
  >
    {body}
  </ReactMarkdown>
</article>
      </section>
    </main>
  );
}
