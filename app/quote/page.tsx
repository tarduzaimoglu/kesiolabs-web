import TeklifAlClient from "@/components/quote/TeklifAlClient";
import { getQuotePage, mediaUrl } from "@/lib/strapi";

function extractMediaUrl(media: any): string | null {
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
