import type { Metadata } from "next";
import TeklifAlClient from "@/components/quote/TeklifAlClient";
import { getQuotePage, mediaUrl } from "@/lib/strapi";

export const metadata: Metadata = {
  title: "3D Baskı Teklifi",
  description: "3D modelinizi yükleyin ve Kesiolabs üretim teklifinizi oluşturun.",
  alternates: { canonical: "/quote" },
};

function extractMediaUrl(media: { url?: string | null } | null | undefined): string | null {
  const url = media?.url ?? null;
  return url ? mediaUrl(url) : null;
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
