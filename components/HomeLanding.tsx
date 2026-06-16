import Image from "next/image";
import Link from "next/link";
import { Box, BookOpen, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";

// --- STRAPI AYARLARI (DOKUNULMADI) ---
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

type NormalizedMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

function normalizeMedia(input: any): NormalizedMedia | null {
  if (!input) return null;
  if (typeof input?.url === "string") {
    return {
      url: input.url,
      alternativeText: input.alternativeText ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
    };
  }
  if (typeof input?.data?.url === "string") {
    return {
      url: input.data.url,
      alternativeText: input.data.alternativeText ?? null,
      width: input.data.width ?? null,
      height: input.data.height ?? null,
    };
  }
  const v4attrs = input?.data?.attributes;
  if (v4attrs?.url) {
    return {
      url: v4attrs.url,
      alternativeText: v4attrs.alternativeText ?? null,
      width: v4attrs.width ?? null,
      height: v4attrs.height ?? null,
    };
  }
  return null;
}

function absStrapiUrl(maybeRelative?: string) {
  if (!maybeRelative) return "";
  if (maybeRelative.startsWith("http://") || maybeRelative.startsWith("https://"))
    return maybeRelative;
  return `${STRAPI_URL}${maybeRelative}`;
}

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
    cache: "no-store",
  });
  let json: any = null;
  try {
    json = await res.json();
  } catch {}
  return { ok: res.ok, status: res.status, json };
}

type GlassCardItem = {
  id?: number;
  title: string;
  subtitle: string;
  href: string;
  icon?: "box" | "book" | "bag";
  enabled?: boolean;
};

type HomeLandingData = {
  heroBgDesktop?: any;
  heroBgMobile?: any;
  cards?: GlassCardItem[];
};

async function fetchHomeLanding(): Promise<HomeLandingData | null> {
  const url =
    `${STRAPI_URL}/api/home-landing` +
    `?populate[0]=heroBgDesktop` +
    `&populate[1]=heroBgMobile` +
    `&populate[2]=cards`;

  const r = await fetchJson(url);
  const d = r.json?.data;
  if (!r.ok || !d) return null;

  return (d.attributes ?? d) as HomeLandingData;
}

function iconNode(icon?: GlassCardItem["icon"]) {
  const common = { className: "w-7 h-7", strokeWidth: 2 };
  if (icon === "book") return <BookOpen {...common} />;
  if (icon === "bag") return <ShoppingBag {...common} />;
  return <Box {...common} />;
}

// --- YENİ EFSANEVİ GLASS CARD TASARIMI ---
function GlassCard({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link 
      href={href} 
      className="group relative flex flex-col justify-between w-full h-full min-h-[320px] p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] hover:border-indigo-500/40 hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]"
    >
      {/* İç Işık (Hover Glow) */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div>
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 mb-8 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight leading-snug group-hover:text-indigo-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-[15px] text-slate-400 leading-relaxed font-medium">
          {subtitle}
        </p>
      </div>

      {/* Yönlendirici Aksiyon Butonu */}
      <div className="flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-indigo-400 mt-8 pt-6 border-t border-white/5 transition-colors duration-300 uppercase tracking-wider">
        Keşfetmeye Başla
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </Link>
  );
}

// --- ANA EKRAN RENDER ---
export default async function HomeLanding() {
  const data = await fetchHomeLanding();

  const heroD = normalizeMedia(data?.heroBgDesktop);
  const heroM = normalizeMedia(data?.heroBgMobile);

  const heroDUrl = heroD?.url ? absStrapiUrl(heroD.url) : null;
  const heroMUrl = heroM?.url ? absStrapiUrl(heroM.url) : null;

  const cards = Array.isArray(data?.cards) ? data!.cards : [];
  const visibleCards = cards.filter((c) => c && c.title && c.href && c.enabled !== false);

  return (
    <section className="relative min-h-screen w-full bg-[#0b1120] flex flex-col justify-center overflow-hidden font-sans">
      
      {/* SİNEMATİK ARKA PLAN EFEKTİ */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        {/* Mobil Görsel */}
        {heroMUrl && (
          <div className="absolute inset-0 md:hidden opacity-30 mix-blend-luminosity">
            <Image src={heroMUrl} alt="Background" fill className="object-cover" priority sizes="100vw" />
          </div>
        )}
        {/* Masaüstü Görsel */}
        {heroDUrl && (
          <div className="absolute inset-0 hidden md:block opacity-30 mix-blend-luminosity">
            <Image src={heroDUrl} alt="Background" fill className="object-cover" priority sizes="100vw" />
          </div>
        )}
        
        {/* Görselin üstüne binen gradientler (Siyah temanın bozulmaması için) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1120]/60 via-[#0b1120]/80 to-[#0b1120]" />
        
        {/* Renkli Işık Hüzmeleri */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* İÇERİK ALANI */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 flex flex-col items-center min-h-screen justify-center">
        
        {/* Karşılama (Hero) Metinleri */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold tracking-wide mb-8 backdrop-blur-sm shadow-xl">
            <Sparkles className="w-4 h-4" />
            Dijital Üretim Laboratuvarı
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] drop-shadow-2xl mb-6">
            Fikrinizi <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Gerçeğe Dönüştürün</span>
          </h1>
          <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            İhtiyacınıza en uygun çözümü seçin. İster hazır 3D modelinizi ürettirin, ister markanıza özel sıfırdan ürünler geliştirelim.
          </p>
        </div>

        {/* Kartlar Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
          {visibleCards.map((c, idx) => (
            <GlassCard
              key={c.id ?? idx}
              icon={iconNode(c.icon)}
              title={c.title}
              subtitle={c.subtitle}
              href={c.href}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}
