import type { Metadata } from "next";
import ArticleListing from "@/components/articles/ArticleListing";
export const metadata: Metadata = { title: "Uygulama Notları", description: "Kesiolabs teknik uygulama notları.", alternates: { canonical: "/makaleler/uygulama-notlari" } };
export default function Page() { return <ArticleListing type="application-note" title="Uygulama Notları" intro="Üretim süreçleri ve uygulama senaryoları için teknik bilgi notları." />; }
