import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Gizlilik Politikası", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPolicyPage() {
  return <StaticPage slug="privacy-policy" fallbackTitle="Gizlilik Politikası" />;
}
