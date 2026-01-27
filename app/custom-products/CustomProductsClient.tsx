"use client";

import React, { useEffect, useMemo, useState } from "react";
import { QuoteForm } from "@/components/custom-products/QuoteForm";
import { ProductTypeGrid } from "@/components/custom-products/ProductTypeGrid";
import type { CustomProductType } from "@/lib/custom-products/types";

export default function CustomProductsClient({ types }: { types: CustomProductType[] }) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // ✅ Çoklu seçim (id = slug)
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);

  // objectURL temizliği (memory leak olmasın)
  const logoUrl = useMemo(() => {
    if (!logoFile) return null;
    return URL.createObjectURL(logoFile);
  }, [logoFile]);

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  const selectedTypes = useMemo(() => {
    const set = new Set(selectedTypeIds);
    return types.filter((t) => set.has(t.id));
  }, [selectedTypeIds, types]);

  const toggleType = (id: string) => {
    setSelectedTypeIds((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  };

  return (
    <>
      <div className="text-4xl font-semibold text-black">
        Firmanıza Özel Ürünler Tasarlayın
      </div>

      <div className="mt-2 text-sm text-neutral-600">
        Logonuzu yükleyin, ürün türlerini seçin ve markanıza özel üretim için teklif alın
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-black">Logonuzu buraya yükleyin</div>

          <label className="mt-4 inline-flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:border-blue-700">
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              className="hidden"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            Logo Seç ve Yükle
          </label>

          <div className="mt-3 text-xs text-neutral-600">
            JPG, PNG veya PDF formatında logo yükleyin
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-black">Önizleme</div>

          <div className="mt-4 rounded-2xl bg-neutral-100 p-6">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt="Logo önizleme"
                className="mx-auto max-h-52 object-contain"
              />
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-neutral-600">
                Logo yüklendiğinde burada gözükecek
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12 overflow-hidden rounded-tl-[192px] bg-white pt-10 md:rounded-tl-[192px]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <div className="text-3xl font-semibold text-black">Ürün Türü Seçin</div>
          </div>

          <div className="mt-8">
            <ProductTypeGrid
              types={types}
              selectedIds={selectedTypeIds}
              onToggle={toggleType}
            />
          </div>

          <div className="mt-10">
            <QuoteForm selectedTypes={selectedTypes} logoFile={logoFile} />
          </div>
        </div>
      </section>
    </>
  );
}
