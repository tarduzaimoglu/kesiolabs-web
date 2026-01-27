// app/custom-products/page.tsx
import CustomProductsClient from "./CustomProductsClient";
import { getCustomProductTypes, getMediaUrl } from "@/lib/strapi";

export default async function CustomProductsPage() {
  // ✅ Strapi'den çek
  const typesFromStrapi = await getCustomProductTypes();

  // ✅ UI komponentlerinin beklediği shape'e çevir (dummy ile aynı)
  // id -> slug (string, stabil)
  // imageUrl -> getMediaUrl(image)
  const types = typesFromStrapi.map((t) => ({
    id: t.slug, // önemli: seçimi slug ile tutuyoruz
    title: t.title,
    imageUrl: t.imageUrl || t.image || "",
  }));

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <CustomProductsClient types={types} />
      </div>
    </main>
  );
}
