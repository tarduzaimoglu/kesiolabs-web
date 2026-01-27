"use client";

import React, { useMemo } from "react";
import type { Product } from "@/lib/products/types";
import { CART_MIN_QTY, FALLBACK_UNIT_PRICE } from "@/components/cart/CartContext";

function resolveImageSrc(product: any) {
  if (typeof product?.imageUrl === "string" && product.imageUrl.trim()) return product.imageUrl;
  if (typeof product?.image === "string" && product.image.trim()) return product.image;
  return "/products/placeholder.png";
}

type Props = {
  product: Product;
  onOpen: () => void;
  isOpen?: boolean;

  // ✅ ProductListWithExpand'ten geliyor — tasarımı bozmadan destekleyelim
  qtyText?: string;
  setQtyText?: (v: string) => void;
};

export function ProductCard({ product, onOpen, isOpen }: Props) {
  const imgSrc = resolveImageSrc(product as any);

  const unitPrice = useMemo(() => {
    const p = (product as any).wholesalePrice;
    return typeof p === "number" ? p : FALLBACK_UNIT_PRICE;
  }, [product]);

  const priceText = useMemo(() => {
    // Strapi’den hazır text varsa onu kullan, yoksa sayıya dön
    return product.wholesalePriceText ?? `${unitPrice} TL/adet`;
  }, [product.wholesalePriceText, unitPrice]);

  const minQtyText = useMemo(() => {
    return product.minQtyText ?? `${CART_MIN_QTY}`;
  }, [product.minQtyText]);

  // küçük üst etiket (varsa)
  const tag = useMemo(() => {
    const t = (product as any)?.badge ?? (product as any)?.tag ?? (product as any)?.categoryTitle;
    return typeof t === "string" && t.trim() ? t.trim() : "";
  }, [product]);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={[
        "group w-full text-left",
        "overflow-hidden rounded-2xl border bg-white shadow-sm",
        "transition hover:shadow-md",
        isOpen ? "border-blue-500 ring-2 ring-blue-200" : "border-slate-200",
      ].join(" ")}
    >
      {/* Görsel */}
      <div className="relative aspect-[1/1] w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain bg-slate-100"
        />

        {/* küçük etiket */}
        {tag ? (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
              {tag}
            </span>
          </div>
        ) : null}
      </div>

      {/* Metin alanı */}
      <div className="p-4">
        <div className="text-[14px] font-semibold leading-snug text-slate-900 line-clamp-2">
          {product.title}
        </div>

        <div className="mt-2 flex items-end justify-between gap-3">
          <div className="text-[13px] font-semibold text-slate-900">{priceText}</div>

          <div className="text-[11px] text-slate-500">
            Min. <span className="font-semibold text-slate-700">{minQtyText}</span>
          </div>
        </div>

        {/* İncele ipucu */}
        <div className="mt-3 text-[12px] font-medium text-blue-600 opacity-90 group-hover:opacity-100">
          Detayları görüntüle →
        </div>
      </div>
    </button>
  );
}
