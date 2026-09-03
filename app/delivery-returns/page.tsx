import type { Metadata } from "next";
import StaticPage from "@/components/StaticPage";

export const metadata: Metadata = { title: "Teslimat ve İade", alternates: { canonical: "/delivery-returns" } };

export default function DeliveryReturnsPage() {
  return <StaticPage slug="delivery-returns" fallbackTitle="Teslimat & İade" />;
}
