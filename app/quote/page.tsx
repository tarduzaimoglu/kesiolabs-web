import TeklifAlClient from "@/components/quote/TeklifAlClient";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

function absUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

function extractMediaUrl(media: any): string | null {
  // Senin Strapi çıktında media direkt { url: "/uploads/..." }
  const url = media?.url ?? null;
  return url ? absUrl(url) : null;
}

async function getQuotePage() {
  const qs = new URLSearchParams();
  qs.set("populate", "howItWorksVideo"); // ✅ sende çalışan format

  const res = await fetch(`${STRAPI_URL}/api/quote-page?${qs.toString()}`, {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : undefined,
    cache: "no-store",
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}

export default async function QuotePage() {
  const data = await getQuotePage();

  const howItWorksTitle = data?.howItWorksTitle ?? "Teklif Almayı Nasıl Kullanırsınız?";
  const howItWorksVideoUrl = extractMediaUrl(data?.howItWorksVideo);

  return (
    <TeklifAlClient
      howItWorksTitle={howItWorksTitle}
      howItWorksVideoUrl={howItWorksVideoUrl}
    />
  );
}
