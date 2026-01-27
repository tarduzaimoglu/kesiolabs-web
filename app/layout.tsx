import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";

// ✅ Senin header/footer dosyaların nerede ise burayı ona göre ayarla:
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "KesioLabs",
  description: "KesioLabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
