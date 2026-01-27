"use client";

import React, { useMemo, useState } from "react";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CartFab } from "@/components/cart/CartIndicator";
import { CART_MIN_QTY } from "@/components/cart/CartContext";

type Product = any;
type Category = { key: string; label: string };

function smartSort(items: Product[]) {
  return [...items].sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (bf !== af) return bf - af;
    return (
      new Date(b.createdAtISO || 0).getTime() -
      new Date(a.createdAtISO || 0).getTime()
    );
  });
}

export default function ProductsClient({
  defaultCat = "featured",
  products,
  categories,
}: {
  defaultCat?: string;
  products: Product[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>(defaultCat);

  // 🔑 TEK KAYNAK: productId → qtyText
  const [qtyById, setQtyById] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (active === "featured") return smartSort(products);
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const getQtyText = (id: any) => qtyById[String(id)] ?? String(CART_MIN_QTY);

  const setQtyText = (id: any, v: string) =>
    setQtyById((prev) => ({ ...prev, [String(id)]: v }));

  return (
    <>
      <div className="w-full flex justify-center">
  <div className="w-full max-w-[1280px] px-4 md:px-0">
    <CategoryTabs
      categories={categories}
      active={active}
      onChange={setActive}
    />
  </div>
</div>

      <div className="mt-6">
        <ProductGrid
          products={filtered}
          qtyTextById={qtyById}
          getQtyText={getQtyText}
          onQtyTextChange={setQtyText}
        />
      </div>

      <CartFab />
    </>
  );
}
