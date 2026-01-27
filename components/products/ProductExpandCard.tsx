"use client";

import React from "react";
import { Product } from "@/lib/products/types";
import { X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useToast } from "@/components/cart/Toast";

function whatsappUrlForProduct(title: string) {
  const phone = "905537538182";
  const text = encodeURIComponent(
    `${title} hakkında bilgi almak istiyorum.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

// pastel tonlar
const ORANGE = "bg-orange-400 hover:bg-orange-500";
const BLUE = "bg-blue-500 hover:bg-blue-600";

export function ProductExpandedCard({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addItem } = useCart();
  const { pushToast } = useToast();

  const imgSrc =
    (product as any).image ??
    (product as any).imageUrl ??
    "/products/placeholder.png";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between px-6 pt-6">
        <h3 className="text-[24px] font-semibold text-slate-900">
          {product.title}
        </h3>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
          aria-label="Kapat"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-6 px-6 pb-6 pt-4 lg:grid-cols-[420px_1fr]">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={imgSrc}
            alt={product.title}
            className="h-[260px] w-full object-cover lg:h-[320px]"
            draggable={false}
          />
        </div>

        {/* INFO */}
        <div className="text-slate-900">
          {product.subtitle && (
            <p className="mb-3 text-[14px] text-slate-700">{product.subtitle}</p>
          )}

          {product.bullets?.length ? (
            <ul className="mb-4 list-disc space-y-1 pl-5 text-[14px] text-slate-800">
              {product.bullets.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}

          {product.specs?.length ? (
            <>
              <div className="mb-2 text-[14px] font-semibold">Ürün Özellikleri:</div>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-[14px] text-slate-800">
                {product.specs.map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-2 text-[14px] text-slate-800">
            <div>Toptan Fiyat: {product.wholesalePriceText ?? "… TL/adet"}</div>
            <div>Min. Adet: {product.minQtyText ?? "…"}</div>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <a
              href={whatsappUrlForProduct(product.title)}
              target="_blank"
              rel="noreferrer"
              className={[
                "h-12 rounded-xl text-white",
                "inline-flex items-center justify-center",
                "text-[14px] font-medium", // <- inceltildi
                ORANGE,
              ].join(" ")}
            >
              Teklif Al
            </a>

            <button
              type="button"
              onClick={() => {
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.wholesalePrice ?? 0,
                  image: imgSrc,
                });
                pushToast({
                  title: "Sepete eklendi",
                  message: product.title,
                });
              }}
              className={[
                "h-12 rounded-xl text-white",
                "text-[14px] font-medium", // <- inceltildi
                BLUE,
              ].join(" ")}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
