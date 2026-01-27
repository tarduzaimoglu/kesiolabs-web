// components/home/HomeLanding.tsx
import Image from "next/image";
import Link from "next/link";
import { Box, BookOpen, ShoppingBag } from "lucide-react";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

type NormalizedMedia = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

function normalizeMedia(input: any): NormalizedMedia | null {
  if (!input) return null;

  // v5: direkt { url }
  if (typeof input?.url === "string") {
    return {
      url: input.url,
      alternativeText: input.alternativeText ?? null,
      width: input.width ?? null,
      height: input.height ?? null,
    };
  }

  // { data: { url } }
  if (typeof input?.data?.url === "string") {
    return {
      url: input.data.url,
      alternativeText: input.data.alternativeText ?? null,
      width: input.data.width ?? null,
      height: input.data.height ?? null,
    };
  }

  // v4: { data: { attributes: { url } } }
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
  const common = { size: 70, strokeWidth: 1.5 } as const;
  if (icon === "book") return <BookOpen {...common} />;
  if (icon === "bag") return <ShoppingBag {...common} />;
  return <Box {...common} />;
}

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
    <Link href={href} className="group">
      <div
        className="
          relative
          w-[260px] h-[360px]
          sm:w-[300px] sm:h-[420px]
          md:w-[360px] md:h-[480px]
          lg:w-[420px] lg:h-[520px]
          px-12
          flex flex-col items-center justify-center gap-8
          text-center
          overflow-hidden

          backdrop-blur-lg
          bg-white/10

          rounded-tl-[96px]
          rounded-tr-[14px]
          rounded-br-[14px]
          rounded-bl-[14px]

          shadow-[0_30px_90px_rgba(0,0,0,0.55)]
          transition-all duration-300
          hover:bg-white/12
          hover:scale-[1.02]
        "
      >
        <div
          className="
            pointer-events-none
            absolute inset-0
            rounded-tl-[96px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px]
            ring-1 ring-white/35
            shadow-[0_0_0_1px_rgba(255,255,255,0.25),0_0_40px_rgba(255,255,255,0.15)]
          "
        />
        <div
          className="
            pointer-events-none
            absolute -top-28 -left-28
            h-80 w-80
            rounded-full
            bg-white/25
            blur-3xl
          "
        />
        <div
          className="
            pointer-events-none
            absolute inset-0
            rounded-tl-[96px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px]
            bg-gradient-to-b
            from-white/12 via-white/6 to-black/25
          "
        />
        <div
          className="
            pointer-events-none
            absolute inset-0
            rounded-tl-[96px] rounded-tr-[14px] rounded-br-[14px] rounded-bl-[14px]
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),inset_0_-40px_80px_rgba(0,0,0,0.28)]
          "
        />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="text-white/85">{icon}</div>

          <h3 className="text-[26px] sm:text-[32px] md:text-[40px] lg:text-5xl font-semibold text-white leading-[1.15] whitespace-pre-line">
            {title}
          </h3>

          <p className="text-[13px] sm:text-[14px] md:text-[16px] lg:text-lg text-white/75 leading-[1.6] whitespace-pre-line">
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function HomeLanding() {
  const data = await fetchHomeLanding();

  const heroD = normalizeMedia(data?.heroBgDesktop);
  const heroM = normalizeMedia(data?.heroBgMobile);

  const heroDUrl = heroD?.url ? absStrapiUrl(heroD.url) : "/hero-bg.png";
  const heroMUrl = heroM?.url ? absStrapiUrl(heroM.url) : "/hero-bg.png";

  const cards = Array.isArray(data?.cards) ? data!.cards : [];
  const visibleCards = cards.filter((c) => c && c.title && c.href && c.enabled !== false);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#003f8f]">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Mobile bg */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src={heroMUrl}
            alt={heroM?.alternativeText || "Hero Background Mobile"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Desktop bg */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={heroDUrl}
            alt={heroD?.alternativeText || "Hero Background Desktop"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-6 py-16">
        <div
          className="
            grid w-full place-items-center gap-10
            grid-cols-1
            md:grid-cols-3 md:gap-14
          "
        >
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
