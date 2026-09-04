import type { Metadata } from "next";
import UretimTalebiClient from "@/components/quote/UretimTalebiClient";

export const metadata: Metadata = {
  title: "3D Üretim",
  description: "Hazır STL modelinizi veya tasarım desteği ihtiyacınızı Kesiolabs teknik değerlendirmesine gönderin.",
  alternates: { canonical: "/3d-uretim" },
  openGraph: { title: "KesioLabs | 3D Üretim", description: "3D baskı, prototipleme, tasarım ve proje özelinde üretim talepleri.", url: "/3d-uretim", type: "website" },
};

export default function UretimPage() {
  return <UretimTalebiClient />;
}
