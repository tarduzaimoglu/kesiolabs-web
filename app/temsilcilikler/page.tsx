import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { RepresentativeLogo } from "@/components/representatives/RepresentativeLogo";
import { getRepresentativeGroups, getRepresentatives } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Temsilcilikler",
  description: "Kesiolabs iş ortakları ve temsil edilen markalar.",
  alternates: { canonical: "/temsilcilikler" },
};

export default async function RepresentativesPage() {
  const [groups, representatives] = await Promise.all([
    getRepresentativeGroups().catch(() => []),
    getRepresentatives().catch(() => []),
  ]);
  const groupedSlugs = new Set(groups.map((group) => group.slug));
  const ungrouped = representatives.filter((item) => !item.groupSlug || !groupedSlugs.has(item.groupSlug));
  const sections = groups.length
    ? [
        ...groups.map((group) => ({
          group,
          items: representatives.filter((item) => item.groupSlug === group.slug),
        })),
        { group: null, items: ungrouped },
      ]
    : [{ group: null, items: representatives }];

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-black/10 bg-black px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DA291C]">Markalar</p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-0.04em] md:text-6xl">Temsilcilikler</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#B7B7B7]">
            Birlikte çalıştığımız teknoloji markalarını ve çözüm alanlarını inceleyin.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        {representatives.length ? (
          <div className="space-y-16">
            {sections.map(({ group, items }) =>
              items.length ? (
                <section key={group?.slug ?? "all"}>
                  <div className="mb-7 flex items-end justify-between border-b border-black/10 pb-4">
                    <h2 className="text-2xl font-bold">{group?.title ?? "İş ortaklarımız"}</h2>
                    <span className="text-xs font-bold text-black/45">{items.length} marka</span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="group flex min-h-80 flex-col border border-black/10 bg-white p-6 transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-[#DA291C]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]"
                      >
                        <RepresentativeLogo name={item.name} logo={item.logo} />
                        <h3 className="mt-6 text-xl font-bold tracking-tight">{item.name}</h3>
                        {item.shortDescription && <p className="mt-3 flex-1 text-sm leading-6 text-black/60">{item.shortDescription}</p>}
                        {item.websiteUrl && (
                          <a href={item.websiteUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-between border-t border-black/10 pt-4 text-sm font-bold text-[#DA291C] hover:text-black">
                            Web sitesini ziyaret et
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null,
            )}
          </div>
        ) : (
          <div className="border border-dashed border-[#B7B7B7] bg-black/[0.02] px-6 py-20 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">İçerik hazırlanıyor</p>
            <h2 className="mt-4 text-2xl font-bold">Marka bilgileri yakında burada olacak.</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/55">Yayınlanan temsilcilik kayıtları bu alanda otomatik olarak görüntülenecek.</p>
          </div>
        )}
      </div>
    </main>
  );
}
