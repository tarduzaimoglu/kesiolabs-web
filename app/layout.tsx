import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";

// ✅ Senin header/footer dosyaların nerede ise burayı ona göre ayarla:
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCatalogCategories } from "@/lib/strapi";

export const metadata = {
  metadataBase: new URL("https://www.kesiolabs.com"),
  title: { default: "KesioLabs | Anasayfa", template: "KesioLabs | %s" },
  description: "Dijital üretim, 3D baskı ve endüstriyel teknoloji çözümleri.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCatalogCategories().catch(() => []);
  return (
    <html lang="tr">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body>
        <CartProvider>
          <Header categories={categories} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
