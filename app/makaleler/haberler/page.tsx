import type { Metadata } from "next";
import ArticleListing from "@/components/articles/ArticleListing";
export const metadata: Metadata = { title: "Haberler", description: "Kesiolabs haberleri ve gelişmeleri.", alternates: { canonical: "/makaleler/haberler" } };
export default function Page() { return <ArticleListing type="news" title="Haberler" intro="Kesiolabs ve endüstriyel teknoloji dünyasından güncel gelişmeler." />; }
