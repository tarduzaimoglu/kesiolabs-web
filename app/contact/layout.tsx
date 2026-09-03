import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Teknik ürün, üretim ve proje ihtiyaçlarınız için Kesiolabs ile iletişime geçin.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
