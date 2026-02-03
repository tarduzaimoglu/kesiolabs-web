import ProductsClient from "./ProductsClient";
import { CartIndicator } from "@/components/cart/CartIndicator";
import { getCatalogProducts, getCatalogCategories } from "@/lib/strapi";

const PAGE_SIZE = 20;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);

  const [products, cats] = await Promise.all([
    getCatalogProducts(page, PAGE_SIZE),
    getCatalogCategories(),
  ]);

  const categories = [{ key: "featured", label: "Öne Çıkanlar" }, ...cats];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="relative flex items-start justify-between">
          <div />
          <div className="hidden md:block">
            <CartIndicator />
          </div>
        </div>

        <div className="mt-6">
          <ProductsClient
            products={products}
            categories={categories}
            defaultCat="featured"
          />
        </div>
      </div>
    </main>
  );
}
