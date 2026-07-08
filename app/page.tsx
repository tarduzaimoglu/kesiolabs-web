import Link from "next/link";
import type { Viewport } from "next";
import HeroSlider from "@/components/main/HeroSlider";
import QuickLinksSection from "@/components/main/QuickLinksSection";
import GrayBannerSlider from "@/components/main/GrayBannerSlider";
import HowItWorksVideo from "@/components/main/HowItWorksVideo";
import FaqAccordion from "@/components/main/FaqAccordion";
import ClosingCtaSection from "@/components/main/ClosingCtaSection";
import { getMainPage, renderBlocks } from "@/lib/strapi-main";
import { ArrowRight, Zap } from "lucide-react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function HomePage() {
  const data = await getMainPage();

  if (!data) {
    return (
      <main className="min-h-screen bg-[#0b1120] flex items-center justify-center px-6">
        <div className="text-center bg-white/[0.02] p-8 border border-white/10 rounded-2xl backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-white">İçerik Alınamadı</h1>
          <p className="mt-2 text-slate-400 text-sm">
            Strapi endpoint veya token ayarlarını kontrol edin.
          </p>
        </div>
      </main>
    );
  }

  const heroBanners = data.heroBanners || [];
  const quickLinks = data.quickLinks || [];
  const white = data.whiteSection;
  const grayBanners = data.grayBanners || [];
  const how = data.howItWorks;
  const faqs = data.faqs || [];
  const closingCta = data.closingCta;

  return (
    <main className="min-h-screen bg-[#0b1120] font-sans selection:bg-indigo-500/30 overflow-hidden">

      {/* A) HERO SLIDER */}
      <div className="relative z-20">
        <HeroSlider banners={heroBanners} />
      </div>

      {/* B) HIZLI YÖNLENDİRME KARTLARI */}
      <QuickLinksSection items={quickLinks} />

      {/* C) HAKKIMIZDA / VİZYON BÖLÜMÜ */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="absolute top-1/2 left-0 w-[600px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {white ? (
            <div className="grid lg:grid-cols-12 gap-12 items-center">

              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold tracking-wide">
                  <Zap className="w-4 h-4" />
                  KesioLabs Vizyonu
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md">
                  {white.title}
                </h2>

                <div className="prose prose-invert prose-slate max-w-none text-slate-400 text-[15px] md:text-[17px] leading-relaxed [&_p]:mb-4">
                  {renderBlocks(white.description)}
                </div>

                {white.buttonText && white.buttonLink ? (
                  <div className="pt-4">
                    <Link
                      href={white.buttonLink}
                      className="group inline-flex items-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 hover:-translate-y-1 transition-all duration-300"
                    >
                      {white.buttonText}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="hidden lg:block lg:col-span-5 relative">
                <div className="w-full aspect-square rounded-full border border-white/5 bg-gradient-to-tr from-white/[0.02] to-transparent backdrop-blur-sm animate-pulse-slow relative flex items-center justify-center">
                   <div className="w-2/3 h-2/3 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md flex items-center justify-center">
                     <span className="text-indigo-400/50 font-bold text-6xl tracking-tighter mix-blend-overlay">KL</span>
                   </div>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </section>

      {/* D) ÜRÜN/KAMPANYA VİTRİNİ (GRAY BANNERS) */}
      <section className="relative z-10 border-y border-white/5 bg-black/20">
        <GrayBannerSlider banners={grayBanners} />
      </section>

      {/* E) NASIL ÇALIŞIR (VİDEO) */}
      {how ? (
        <HowItWorksVideo
          title={how.title}
          description={how.description}
          video={how.video}
          posterImage={how.posterImage}
        />
      ) : null}

      {/* F) FAQ */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-transparent to-black/40">
        <FaqAccordion faqs={faqs} />
      </section>

      {/* G) KAPANIŞ CTA */}
      <ClosingCtaSection data={closingCta} />

    </main>
  );
}
