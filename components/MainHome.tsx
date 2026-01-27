"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * ✅ MASAÜSTÜ hero banner oranı
 * Banner ölçüne göre bunu ayarla:
 * Örn 1920x650 -> "aspect-[1920/650]"
 */
const HERO_ASPECT = "aspect-[1920/650]";

/**
 * ✅ Alt (secondary) banner oranı
 * Örn 1920x480 -> "aspect-[1920/480]"
 */
const SECONDARY_ASPECT = "aspect-[1920/480]";

/**
 * ✅ WhatsApp linki (90XXXXXXXXXX yerine numaran)
 */
const WHATSAPP_LINK =
  "https://wa.me/90XXXXXXXXXX?text=Merhaba%20KesioLabs%2C%20bilgi%20almak%20istiyorum.";

/**
 * ✅ YouTube video
 */
const YOUTUBE_ID = "XBYhQnjyrWo";

/**
 * ✅ HERO: mobil + masaüstü ayrı görsel
 * Mobil görseller KARE (1:1)
 */
const HERO_BANNERS = [
  {
    id: "h1",
    desktopSrc: "/banners/hero-1-desktop.png",
    mobileSrc: "/banners/hero-1-mobile.png",
  },
  {
    id: "h2",
    desktopSrc: "/banners/hero-2-desktop.png",
    mobileSrc: "/banners/hero-2-mobile.png",
  },
  {
    id: "h3",
    desktopSrc: "/banners/hero-3-desktop.png",
    mobileSrc: "/banners/hero-3-mobile.png",
  },
];

/**
 * ✅ Secondary bannerlar (şimdilik 2 test)
 */
const SECONDARY_BANNERS = [
  { id: "s1", imageSrc: "/banners/secondary-1.png" },
  { id: "s2", imageSrc: "/banners/secondary-2.png" },
];

/**
 * ✅ FAQ içerikleri
 */
const FAQ_ITEMS = [
  {
    q: "3D dosyamı nasıl yüklerim?",
    a: "STL formatındaki 3D dosyanızı yükleme alanına sürükleyebilir ya da cihazınızdan seçerek sisteme ekleyebilirsiniz. Dosya yüklendikten sonra model otomatik olarak analiz edilir.",
  },
  {
    q: "Fiyat nasıl hesaplanır?",
    a: "Fiyatlandırma; modelin hacmi, seçilen malzeme, doluluk oranı ve adet bilgisine göre otomatik hesaplanır. Ek gereksinimler için ekibimiz sizinle iletişime geçebilir.",
  },
  {
    q: "Hangi malzemelerle üretim yapıyorsunuz?",
    a: "PLA, PETG ve ABS başta olmak üzere farklı kullanım senaryolarına uygun malzemelerle üretim yapıyoruz.",
  },
  {
    q: "Üretim ve kargo süresi ne kadar sürer?",
    a: "Standart siparişler genellikle 1–3 iş günü içinde üretilir. Kargo süresi bulunduğunuz lokasyona göre değişiklik gösterebilir.",
  },
];

const AUTOPLAY_MS = 6500;

function clampIndex(i: number, len: number) {
  if (len <= 0) return 0;
  return (i + len) % len;
}

function useAutoplay(len: number, enabled: boolean, delayMs: number, onNext: () => void) {
  const saved = useRef(onNext);
  useEffect(() => {
    saved.current = onNext;
  }, [onNext]);

  useEffect(() => {
    if (!enabled || len <= 1) return;
    const t = setInterval(() => saved.current(), delayMs);
    return () => clearInterval(t);
  }, [enabled, len, delayMs]);
}

function Dots({
  count,
  active,
  onPick,
}: {
  count: number;
  active: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          aria-label={`Banner ${i + 1}`}
          onClick={() => onPick(i)}
          className={[
            "h-2.5 w-2.5 rounded-full transition",
            i === active ? "bg-white" : "bg-white/40 hover:bg-white/70",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

/**
 * ✅ HERO Slider
 * - Mobilde kare görsel (sm:hidden)
 * - Masaüstünde yatay görsel (hidden sm:block)
 * - Kırpma yok: object-contain
 * - Mavi çerçeve YOK
 */
function HeroSlider({
  items,
}: {
  items: { id: string; desktopSrc: string; mobileSrc: string }[];
}) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useAutoplay(items.length, !paused, AUTOPLAY_MS, () => {
    setIdx((p) => clampIndex(p + 1, items.length));
  });

  const current = items[idx];

  return (
    <section
      className="relative z-0 w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ✅ MOBİL: Kare banner */}
      <div className="relative w-full aspect-square bg-slate-900 sm:hidden">
        <Image
          src={current.mobileSrc}
          alt="KesioLabs mobil banner"
          fill
          priority
          className="object-contain"
        />
        <Dots count={items.length} active={idx} onPick={setIdx} />
      </div>

      {/* ✅ MASAÜSTÜ/TABLET: Yatay banner */}
      <div className="relative hidden w-full bg-slate-900 sm:block">
        <div className={`relative w-full ${HERO_ASPECT}`}>
          <Image
            src={current.desktopSrc}
            alt="KesioLabs banner"
            fill
            priority
            className="object-contain"
          />
          <Dots count={items.length} active={idx} onPick={setIdx} />
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ Secondary banner slider (sadece görsel)
 */
function SecondaryBannerSlider({ items }: { items: { id: string; imageSrc: string }[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useAutoplay(items.length, !paused, 7000, () => {
    setIdx((p) => clampIndex(p + 1, items.length));
  });

  const current = items[idx];

  return (
    <section
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className={`relative w-full ${SECONDARY_ASPECT} bg-slate-200`}>
            <Image src={current.imageSrc} alt="KesioLabs banner" fill className="object-contain" />
            <Dots count={items.length} active={idx} onPick={setIdx} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ Radiuslu beyaz alan (banner'ın altından başlayıp üstüne biner)
 * Mobilde radius otomatik yarı: 96px, desktop: 192px
 */
function WhiteContentBlock() {
  return (
    <section className="w-full bg-white">
      <div
        className="
          relative z-10
          -mt-10 sm:-mt-14
          bg-white
          rounded-tl-[96px] md:rounded-tl-[192px]
          shadow-[0_-10px_40px_rgba(0,0,0,0.08)]
        "
      >
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Dijital Üretimde Güvenilir ve Yenilikçi Çözümler
              </h2>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
                KesioLabs; endüstriyel 3D üretim için tasarım, malzeme bilgisi ve üretim kontrol
                süreçlerini bir araya getirir. İster prototip ister seri üretim olsun, hedefimiz
                tutarlı kalite ve öngörülebilir teslimattır.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/about"
                  className="inline-flex items-center rounded-xl bg-[#ff7a00] px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
                >
                  Hakkımızda
                </a>

                <a
                  href="/quote"
                  className="inline-flex items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                >
                  Teklif Al
                </a>
              </div>
            </div>

            {/* Sağ görsel alanı (istersen kendi png'n ile değiştir) */}
            <div className="relative">
              <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                <Image
                  src="/banners/section-gear.png"
                  alt="KesioLabs - dijital üretim"
                  fill
                  className="object-contain p-6"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ara gri band */}
        <div className="w-full bg-slate-100">
          <div className="mx-auto w-full max-w-6xl px-6 py-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Siz fikri ortaya koyun, KesioLabs hayata geçirsin
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">
                  Dosyanızı yükleyin, malzeme ve adet seçeneklerini belirleyin. Üretilebilirlik
                  kontrolü ve fiyatlandırma süreçlerimizle hızlı şekilde ilerleyelim.
                </p>
              </div>
              <div className="flex justify-start md:justify-end">
                <a
                  href="/quote"
                  className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition"
                >
                  Hemen Teklif Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksVideo({ youtubeId }: { youtubeId: string }) {
  return (
    <section className="w-full py-12">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Böyle Çalışır</h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Tekliften üretime, süreci kısa bir videoyla anlatıyoruz.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="KesioLabs - Böyle Çalışır"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="w-full pb-16">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Üretim Süreci Hakkında
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Sipariş ve üretim süreciyle ilgili en sık sorulan soruların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              {FAQ_ITEMS.map((x, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200 bg-white px-5 py-4"
                >
                  <summary className="cursor-pointer list-none select-none">
                    <div className="flex items-center justify-between gap-4">
                      <div className="text-sm sm:text-base font-semibold text-slate-900">
                        {x.q}
                      </div>
                      <div className="text-slate-500 group-open:rotate-180 transition-transform">
                        ▼
                      </div>
                    </div>
                  </summary>

                  <div className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-700">
                    {x.a}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-5 text-sm text-slate-600">
              Aradığınız cevabı bulamadınız mı?{" "}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
                Bizimle iletişime geçin →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MainHome() {
  return (
    <div className="w-full">
      {/* 1) Hero slider */}
      <HeroSlider items={HERO_BANNERS} />

      {/* 2) Radiuslu beyaz alan */}
      <WhiteContentBlock />

      {/* 3) Alt banner slider */}
      <div className="py-12">
        <SecondaryBannerSlider items={SECONDARY_BANNERS} />
      </div>

      {/* 4) Video */}
      <HowItWorksVideo youtubeId={YOUTUBE_ID} />

      {/* 5) FAQ */}
      <FaqSection />
    </div>
  );
}
