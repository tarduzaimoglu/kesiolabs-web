import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Box, DraftingCompass, Factory, Layers3 } from "lucide-react";
import { getAboutPage, getMediaUrl } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Kesiolabs; endüstriyel teknik ürünleri, dijital üretim kabiliyetlerini ve ürün geliştirme yaklaşımını aynı çözüm yapısında buluşturur.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Kesiolabs Hakkında | Endüstriyel Teknoloji ve Üretim",
    description: "Endüstriyel teknoloji, teknik ürün çözümleri, dijital üretim ve ürün geliştirme yaklaşımımızı keşfedin.",
    url: "/about",
    type: "website",
  },
};

const fallbackActivities = [
  {
    order: 1,
    title: "Endüstriyel Ürünler ve Teknik Çözümler",
    description: "Endüstriyel ve laboratuvar uygulamalarına yönelik teknik ürün ve ekipman ihtiyaçlarını, kullanım amacı ve teknik gereksinimler doğrultusunda değerlendiriyoruz.",
  },
  {
    order: 2,
    title: "Dijital Üretim ve Prototipleme",
    description: "3D baskı, prototip üretimi ve tekrarlanabilir üretim süreçlerinde malzeme, geometri ve üretilebilirlik gereksinimlerini birlikte ele alıyoruz.",
  },
  {
    order: 3,
    title: "Ürün Geliştirme ve Özel Üretim",
    description: "Proje özelindeki ihtiyacı tasarım geliştirme, numune, üretim hazırlığı ve uygulamaya uygun çözüm adımlarıyla ilerletiyoruz.",
  },
] as const;

const fallbackConsiderations = ["Kullanım amacı", "Teknik gereksinimler", "Üretilebilirlik", "Malzeme ve süreç seçimi", "Tekrarlanabilirlik", "Kalite ve proje kısıtları"];

const fallbackPrinciples = [
  { order: 1, title: "Teknik Netlik", description: "İhtiyacı, kısıtları ve beklenen sonucu üretim veya ürün seçimi başlamadan önce açık biçimde tanımlarız." },
  { order: 2, title: "Üretilebilirlik", description: "Tasarım ve teknik kararları yalnızca görünüşe göre değil, uygulanabilir ve sürdürülebilir üretime göre değerlendiririz." },
  { order: 3, title: "Tutarlılık", description: "Numuneden tekrarlı üretime kadar süreçlerin ölçülebilir ve yeniden uygulanabilir olmasına önem veririz." },
  { order: 4, title: "Şeffaf İletişim", description: "Teknik seçenekleri, sınırlamaları ve proje adımlarını anlaşılır biçimde paylaşırız." },
] as const;

const fallbackPositioning = [
  "Her ürün ve proje aynı yöntemle çözülemez. Bu nedenle önce kullanım amacını, teknik gereksinimleri ve uygulama koşullarını değerlendiriyoruz.",
  "İhtiyaca göre teknik ürün tedariği, endüstriyel veya laboratuvar ekipmanı, dijital üretim, prototipleme ya da özel ürün geliştirme seçeneklerinden uygun olanı belirliyoruz.",
  "Amacımız belirli bir yöntemi öne çıkarmak değil; ürün, teknoloji ve üretim kararlarını aynı teknik çerçevede buluşturmaktır.",
];

const fallbackProduction = [
  "FDM üretim ve prototipleme kabiliyetimiz; tasarım doğrulama, numune üretimi, üretime hazırlık ve uygun projelerde tekrarlanabilir üretim için kullanılır.",
  "Geometri, malzeme ve proses kararlarını üretilebilirlik bakışıyla değerlendirerek dijital modelden fiziksel ürüne kontrollü bir geçiş hedefleriz.",
];

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function paragraphs(value: unknown, fallback: readonly string[]) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  const items = value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  return items.length ? items : fallback;
}

function heroHeading(value: string) {
  const accent = "aynı çözüm yaklaşımında";
  const index = value.toLocaleLowerCase("tr-TR").indexOf(accent);
  if (index < 0) return value;
  return <>{value.slice(0, index)}<span className="text-[#DA291C]">{value.slice(index, index + accent.length)}</span>{value.slice(index + accent.length)}</>;
}

export default async function AboutPage() {
  const { data } = await getAboutPage().catch(() => ({ data: null }));
  const activityIcons = [Factory, Layers3, DraftingCompass];
  const activities = data?.activityAreas?.length ? [...data.activityAreas].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : fallbackActivities;
  const considerations = data?.approachPoints?.length ? [...data.approachPoints].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((item) => item.title).filter(Boolean) : fallbackConsiderations;
  const principles = data?.principles?.length ? [...data.principles].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : fallbackPrinciples;
  const heroImage = getMediaUrl(data?.heroImage);

  return <main className="overflow-hidden bg-white text-black">
    <section className="relative border-b border-black/10 bg-[#F7F7F5] px-6 py-20 md:py-28 lg:py-32">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] overflow-hidden border-l border-black/[0.06] lg:block" aria-hidden={heroImage ? undefined : "true"}>{heroImage ? <Image src={heroImage} alt="" fill sizes="38vw" className="object-cover" /> : <><div className="absolute inset-x-0 top-1/3 border-t border-black/[0.055]" /><div className="absolute inset-x-0 top-2/3 border-t border-black/[0.055]" /><div className="absolute inset-y-0 left-1/2 border-l border-black/[0.055]" /><Box className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 stroke-[0.55] text-black/20" /></>}</div>
      <div className="relative mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#DA291C]">{text(data?.heroEyebrow, "Kesiolabs")}</p><h1 className="mt-7 max-w-5xl text-[clamp(2.75rem,5.3vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.055em]">{heroHeading(text(data?.heroTitle, "Teknoloji, tasarım ve üretimi aynı çözüm yaklaşımında buluşturuyoruz."))}</h1><p className="mt-8 max-w-3xl text-base leading-8 text-black/62 md:text-lg">{text(data?.heroDescription, "Kesiolabs; endüstriyel ve laboratuvar uygulamalarına yönelik teknik ürünleri, dijital üretim kabiliyetlerini ve ürün geliştirme yaklaşımını aynı yapı altında bir araya getirir.")}</p></div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" aria-labelledby="positioning-title">
      <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.positioningEyebrow, "Kesiolabs ne yapar?")}</p><h2 id="positioning-title" className="mt-5 text-4xl font-bold leading-[1.04] tracking-[-0.045em] md:text-5xl">{text(data?.positioningTitle, "Tek bir üretim yöntemine değil, doğru çözüme odaklanıyoruz.")}</h2></div>
      <div className="space-y-6 border-l border-black/10 pl-7 text-base leading-8 text-black/62 md:pl-10 md:text-lg">{paragraphs(data?.positioningDescription, fallbackPositioning).map((item) => <p key={item}>{item}</p>)}</div>
    </section>

    <section className="border-y border-black/10 bg-[#F7F7F5] px-6 py-20 md:py-28" aria-labelledby="activities-title"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.activitiesEyebrow, "Çözüm kapsamı")}</p><h2 id="activities-title" className="mt-4 text-4xl font-bold tracking-[-0.045em] md:text-5xl">{text(data?.activitiesTitle, "Faaliyet Alanlarımız")}</h2><div className="mt-12 divide-y divide-black/10 border-y border-black/10">{activities.map((item, index) => { const Icon = activityIcons[index % activityIcons.length]; return <article key={`${item.title}-${index}`} className="grid gap-5 py-8 md:grid-cols-[80px_1fr_1.15fr] md:items-start md:gap-10"><div className="flex items-center gap-4"><span className="text-xs font-bold text-[#DA291C]">{String(item.order ?? index + 1).padStart(2, "0")}</span><Icon className="h-5 w-5 stroke-[1.5] text-black/45" /></div><h3 className="text-xl font-bold leading-tight md:text-2xl">{item.title}</h3><p className="text-sm leading-7 text-black/58 md:text-base">{item.description}</p></article>; })}</div></div></section>

    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.05fr_.95fr] lg:gap-20" aria-labelledby="approach-title"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.approachEyebrow, "Yaklaşımımız")}</p><h2 id="approach-title" className="mt-5 max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.045em] md:text-5xl">{text(data?.approachTitle, "Tasarım bizim için yalnızca nasıl göründüğü değil, nasıl çalıştığı ve nasıl üretildiğidir.")}</h2><p className="mt-7 max-w-2xl text-base leading-8 text-black/60">{text(data?.approachDescription, "Bir ürünün başarısını görünüş veya hız tek başına belirlemez. Teknik kararları kullanım, üretim ve proje gerçekleriyle birlikte değerlendiririz.")}</p></div><div className="grid grid-cols-2 border-l border-t border-black/10">{considerations.map((item, index) => <div key={`${item}-${index}`} className="min-h-32 border-b border-r border-black/10 p-5"><span className="text-[10px] font-bold tracking-[0.15em] text-[#DA291C]">{String(index + 1).padStart(2, "0")}</span><p className="mt-5 text-sm font-bold leading-5">{item}</p></div>)}</div></section>

    <section className="bg-black px-6 py-20 text-white md:py-28" aria-labelledby="production-title"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.productionEyebrow, "Üretim kabiliyeti")}</p><h2 id="production-title" className="mt-5 text-4xl font-bold tracking-[-0.045em] text-white md:text-5xl">{text(data?.productionTitle, "Dijital üretimi, ürün geliştirme sürecinin bir parçası olarak görüyoruz.")}</h2></div><div className="flex flex-col justify-between"><div className="space-y-5 text-base leading-8 text-[#B7B7B7]">{paragraphs(data?.productionDescription, fallbackProduction).map((item) => <p key={item}>{item}</p>)}</div><div className="mt-10 flex flex-wrap gap-3"><Link href="/3d-uretim" className="inline-flex items-center gap-3 bg-[#DA291C] px-6 py-4 text-sm font-bold text-white hover:bg-white hover:text-black">3D Üretim Talebi <ArrowRight className="h-4 w-4" /></Link><Link href="/custom-products" className="inline-flex items-center gap-3 border border-white/25 px-6 py-4 text-sm font-bold text-white hover:border-white">Özel Üretimi İncele <ArrowUpRight className="h-4 w-4" /></Link></div></div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-20 md:py-28" aria-labelledby="principles-title"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.principlesEyebrow, "Çalışma biçimi")}</p><h2 id="principles-title" className="mt-4 text-4xl font-bold tracking-[-0.045em] md:text-5xl">{text(data?.principlesTitle, "Çalışma Prensiplerimiz")}</h2></div><div className="mt-12 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">{principles.map((item, index) => <article key={`${item.title}-${index}`} className="flex min-h-64 flex-col border-b border-r border-black/10 p-6"><span className="text-xs font-bold text-[#DA291C]">{String(item.order ?? index + 1).padStart(2, "0")}</span><h3 className="mt-12 text-xl font-bold">{item.title}</h3><p className="mt-4 text-sm leading-6 text-black/58">{item.description}</p></article>)}</div></section>

    <section className="px-6 pb-20 md:pb-28"><div className="mx-auto max-w-7xl border-t-4 border-[#DA291C] bg-[#F7F7F5] px-7 py-14 md:px-14 md:py-16"><div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{text(data?.ctaEyebrow, "İletişim")}</p><h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.045em] md:text-5xl">{text(data?.ctaTitle, "Teknik ihtiyacınızı birlikte değerlendirelim.")}</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-black/60">{text(data?.ctaDescription, "İhtiyacınız endüstriyel bir ürün, prototip veya projeye özel üretim çözümü olabilir. Gereksinimlerinizi paylaşın, uygun yaklaşımı birlikte belirleyelim.")}</p></div><div className="flex shrink-0 flex-col gap-3 sm:flex-row"><Link href={text(data?.primaryCtaHref, "/contact")} className="inline-flex items-center justify-center gap-3 bg-[#DA291C] px-6 py-4 text-sm font-bold text-white hover:bg-black">{text(data?.primaryCtaLabel, "İletişime Geçin")} <ArrowUpRight className="h-4 w-4" /></Link><Link href={text(data?.secondaryCtaHref, "/products")} className="inline-flex items-center justify-center gap-3 border border-black/20 px-6 py-4 text-sm font-bold hover:bg-black hover:text-white">{text(data?.secondaryCtaLabel, "Ürünleri İncele")} <ArrowRight className="h-4 w-4" /></Link></div></div></div></section>
  </main>;
}
