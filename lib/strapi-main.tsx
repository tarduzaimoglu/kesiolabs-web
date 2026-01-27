// lib/strapi-main.tsx
import type { ReactNode } from "react";

type AnyObj = Record<string, any>;

export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";

const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

/** Strapi media url'ini absolute yap */
export function getMediaUrl(input?: string | null) {
  if (!input) return "";
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  return `${STRAPI_URL}${input}`;
}

/** Strapi Blocks (rich text) -> basit JSX (paragraf) */
export function renderBlocks(blocks: any): ReactNode[] {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((b) => b?.type === "paragraph" && Array.isArray(b.children))
    .map((b, idx) => {
      const text = b.children
        .filter((c: AnyObj) => c?.type === "text")
        .map((c: AnyObj) => c.text || "")
        .join("");

      // boş paragraf ise küçük boşluk bırak
      if (!text.trim()) return <div key={idx} className="h-3" />;

      return (
        <p key={idx} className="text-sm md:text-base leading-relaxed text-slate-600">
          {text}
        </p>
      );
    });
}

export type MainPageData = {
  id: number;
  heroBanners: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    imageDesktop?: AnyObj | null;
    imageMobile?: AnyObj | null;
  }>;
  whiteSection?: {
    id: number;
    title: string;
    description?: any;
    buttonText?: string | null;
    buttonLink?: string | null;
  } | null;
  grayBanners: Array<{
    id: number;
    title: string;
    subtitle?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    image?: AnyObj | null;
  }>;
  howItWorks?: {
    id: number;
    title: string;
    description?: string | null;
    video?: AnyObj | null;
    posterImage?: AnyObj | null;
  } | null;
  faqs: Array<{
    id: number;
    question: string;
    answer?: any;
  }>;
};

export async function getMainPage(): Promise<MainPageData | null> {
  const qs =
    "populate[heroBanners][populate]=*&populate[whiteSection][populate]=*&populate[grayBanners][populate]=*&populate[howItWorks][populate]=*&populate[faqs][populate]=*";

  const url = `${STRAPI_URL}/api/main-page?${qs}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    },
  });

  if (!res.ok) return null;

  const json = await res.json();
  return json?.data ?? null;
}
