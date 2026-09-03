import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Sık Sorulan Sorular", alternates: { canonical: "/faq" } };

export default function FAQPage() {
  return <StaticPage slug="faq" fallbackTitle="Sık Sorulan Sorular" />;
}
