import type { Metadata } from "next";
import ArticleListing from "@/components/articles/ArticleListing";
export const metadata: Metadata = { title: "Makaleler", description: "Kesiolabs makaleleri, haberleri ve uygulama notları.", alternates: { canonical: "/makaleler" } };
export default function Page() { return <ArticleListing title="Makaleler" intro="Dijital üretim, malzeme teknolojileri ve endüstriyel uygulamalara dair güncel içerikler." />; }
