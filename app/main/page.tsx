// app/main/page.tsx
import Link from "next/link";
import HeroSlider from "@/components/main/HeroSlider";
import GrayBannerSlider from "@/components/main/GrayBannerSlider";
import HowItWorksVideo from "@/components/main/HowItWorksVideo";
import FaqAccordion from "@/components/main/FaqAccordion";
import { getMainPage, renderBlocks } from "@/lib/strapi-main";

export default async function MainPage() {
  const data = await getMainPage();

  if (!data) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Main Page içeriği alınamadı</h1>
          <p className="mt-2 text-slate-600 text-sm">
            Strapi endpoint/permission veya token ayarlarını kontrol edin.
          </p>
        </div>
      </main>
    );
  }

  const heroBanners = data.heroBanners || [];
  const white = data.whiteSection;
  const grayBanners = data.grayBanners || [];
  const how = data.howItWorks;
  const faqs = data.faqs || [];

  return (
    <main className="bg-white">
      {/* A) HERO SLIDER */}
      <HeroSlider banners={heroBanners} />

      <section className="bg-white border-t border-slate-200">
  <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
    {white ? (
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
          {white.title}
        </h2>

        <div className="mt-4 space-y-3">{renderBlocks(white.description)}</div>

        {white.buttonText && white.buttonLink ? (
          <div className="mt-6">
            <Link
              href={white.buttonLink}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-50"
            >
              {white.buttonText}
            </Link>
          </div>
        ) : null}
      </div>
    ) : null}
  </div>
</section>

      {/* C) GRAY BANNERS */}
      <GrayBannerSlider banners={grayBanners} />

      {/* D) HOW IT WORKS VIDEO */}
      {how ? (
        <HowItWorksVideo
          title={how.title}
          description={how.description}
          video={how.video}
          posterImage={how.posterImage}
        />
      ) : null}

      {/* E) FAQ */}
      <FaqAccordion faqs={faqs} />
    </main>
  );
}
