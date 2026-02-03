"use client";

import React, { useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import CatalogPagination from "@/components/products/CatalogPagination";
import { CartFab } from "@/components/cart/CartIndicator";
import { CART_MIN_QTY } from "@/components/cart/CartContext";

type Product = any;
type Category = { key: string; label: string };

type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export default function ProductsClient({
  defaultCat = "featured",
  products,
  categories,
  pagination,
}: {
  defaultCat?: string;
  products: Product[];
  categories: Category[];
  pagination: Pagination;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [active, setActive] = useState<string>(defaultCat);

  // 🔑 TEK KAYNAK: productId → qtyText
  const [qtyById, setQtyById] = useState<Record<string, string>>({});

  // server pagination’dan
  const page = pagination?.page ?? 1;
  const pageCount = pagination?.pageCount ?? 1;

  // URL -> state eşitle (geri/ileri vb.)
  useEffect(() => {
    const catFromUrl = (sp?.get("cat") ?? defaultCat).toString();
    setActive(catFromUrl);
  }, [sp, defaultCat]);

  const getQtyText = (id: any) => qtyById[String(id)] ?? String(CART_MIN_QTY);

  const setQtyText = (id: any, v: string) =>
    setQtyById((prev) => ({ ...prev, [String(id)]: v }));

  function pushParams(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  }

  function changePage(nextPage: number) {
    const safe = Math.min(Math.max(1, nextPage), pageCount);
    const next = new URLSearchParams(sp?.toString() ?? "");
    if (safe <= 1) next.delete("page");
    else next.set("page", String(safe));
    pushParams(next);
  }

  function changeCategory(nextCat: string) {
    setActive(nextCat);
    const next = new URLSearchParams(sp?.toString() ?? "");
    // kategori paramı
    if (!nextCat || nextCat === "featured") next.delete("cat");
    else next.set("cat", nextCat);
    // kategori değişince sayfayı sıfırla
    next.delete("page");
    pushParams(next);
  }

  // Bu sayfada zaten server’dan ürünler gelmiş durumda
  const shown = useMemo(() => products, [products]);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[1280px] px-4 md:px-0">
          <CategoryTabs
            categories={categories}
            active={active}
            onChange={changeCategory}
          />
        </div>
      </div>

      <div className="mt-6">
        <ProductGrid
          products={shown}
          qtyTextById={qtyById}
          getQtyText={getQtyText}
          onQtyTextChange={setQtyText}
        />
      </div>

      <div className="mt-10 flex justify-center">
        <CatalogPagination page={page} pageCount={pageCount} onChange={changePage} />
      </div>

      <CartFab />
    </>
  );
}
