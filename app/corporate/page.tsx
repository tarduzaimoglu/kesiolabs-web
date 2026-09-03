import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Kurumsal", alternates: { canonical: "/corporate" } };

export default function CorporatePage() {
  return <StaticPage slug="corporate" fallbackTitle="Kurumsal" />;
}
