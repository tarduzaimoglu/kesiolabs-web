import CustomProductsClient from "./CustomProductsClient";
import { getCustomProductTypes, getMediaUrl } from "@/lib/strapi";

export default async function CustomProductsPage() {
  // ✅ Strapi'den çek
  const typesFromStrapi = await getCustomProductTypes();

  // ✅ UI komponentlerinin beklediği shape'e çevir
  const types = typesFromStrapi.map((t) => ({
    id: t.slug,
    title: t.title,
    imageUrl: t.imageUrl || t.image || "",
  }));

  return (
    <main className="min-h-screen bg-[#0b1120] font-sans overflow-hidden relative">
      {/* Genel Arka Plan Işık Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1120]/80 to-[#0b1120] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
        <CustomProductsClient types={types} />
      </div>
    </main>
  );
}
