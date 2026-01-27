/* ===========================
   FILE: ProductListWithExpand.tsx
   (YENİ DOSYA EKLE)
   Ürünleri map ettiğin yerde bunu kullan.
=========================== */

"use client";

import React, { useMemo, useState } from "react";
import { Product } from "@/lib/products/types";
import { ProductCard } from "./ProductCard";
import { ProductExpandPanel } from "./ProductExpandPanel";
import { CART_MIN_QTY } from "@/components/cart/CartContext";
type Props = {
  product: Product;
  onClose: () => void;

  // ✅ EKLE
  qtyText: string;
  setQtyText: (v: string) => void;
};
export function ProductListWithExpand({ products }: { products: Product[] }) {

  const [openId, setOpenId] = useState<string | null>(null);

  // ✅ Tek kaynak: productId -> qtyText
  const [qtyById, setQtyById] = useState<Record<string, string>>({});

  const openProduct = useMemo(
    () => products.find((p) => p.id === openId) ?? null,
    [openId, products]
  );

  const getQtyText = (id: string) => qtyById[id] ?? String(CART_MIN_QTY);

  const setQtyText = (id: string, v: string) =>
    setQtyById((prev) => ({ ...prev, [id]: v }));

  return (
    <>
      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isOpen={openId === p.id}
            onOpen={() => setOpenId(p.id)}
            qtyText={getQtyText(p.id)}
            setQtyText={(v) => setQtyText(p.id, v)}
          />
        ))}
      </div>

      {/* EXPAND / MODAL */}
      {openProduct ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl">
            <ProductExpandPanel
              product={openProduct}
              onClose={() => setOpenId(null)}
              qtyText={getQtyText(openProduct.id)}
              setQtyText={(v: string) => setQtyText(openProduct.id, v)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}