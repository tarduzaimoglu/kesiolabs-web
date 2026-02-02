"use client";

import React, { useMemo, useState } from "react";
import { QuoteForm } from "@/components/custom-products/QuoteForm";
import { ProductTypeGrid } from "@/components/custom-products/ProductTypeGrid";
import type { CustomProductType } from "@/lib/custom-products/types";
import Logo3DPreview from "@/components/custom-products/Logo3DPreview";

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  const val = bytes / Math.pow(k, i);
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function fileExt(name: string) {
  const idx = name.lastIndexOf(".");
  return idx >= 0 ? name.slice(idx + 1).toUpperCase() : "";
}

export default function CustomProductsClient({ types }: { types: CustomProductType[] }) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Çoklu seçim (id = slug)
  const [selectedTypeIds, setSelectedTypeIds] = useState<string[]>([]);

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

  const acceptFile = (f: File | null | undefined) => {
    if (!f) return;

    // basit doğrulama
    const okTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!okTypes.includes(f.type)) {
      alert("Lütfen PNG, JPG veya PDF yükleyin.");
      return;
    }

    // örnek limit
    const maxMb = 12;
    if (f.size > maxMb * 1024 * 1024) {
      alert(`Dosya çok büyük. Lütfen ${maxMb}MB altı yükleyin.`);
      return;
    }

    setLogoFile(f);
  };

  return (
    <>
      <div className="text-4xl font-semibold text-black">Firmanıza Özel Ürünler Tasarlayın</div>

      <div className="mt-2 text-sm text-neutral-600">
        Logonuzu yükleyin, ürün türlerini seçin ve markanıza özel üretim için teklif alın
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* SOL: Upload (A + C) */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-black">Logonuzu buraya yükleyin</div>

          {/* Mini akış (A) */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs font-semibold text-neutral-900">1</div>
              <div className="mt-1 text-sm font-medium text-neutral-900">Logo Yükleyin</div>
              <div className="mt-1 text-xs text-neutral-600">PNG/JPG/PDF</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs font-semibold text-neutral-900">2</div>
              <div className="mt-1 text-sm font-medium text-neutral-900">Ürün Seçin</div>
              <div className="mt-1 text-xs text-neutral-600">Birden fazla</div>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
              <div className="text-xs font-semibold text-neutral-900">3</div>
              <div className="mt-1 text-sm font-medium text-neutral-900">Teklif Alın</div>
              <div className="mt-1 text-xs text-neutral-600">Hızlı dönüş</div>
            </div>
          </div>

          {/* Drag&Drop (C) */}
          <div
            className={[
              "mt-5 rounded-2xl border-2 border-dashed p-5 transition",
              isDragging ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-white",
            ].join(" ")}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              acceptFile(f);
            }}
          >
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  Dosyayı buraya sürükleyip bırakın
                </div>
                <div className="mt-1 text-xs text-neutral-600">
                  Tercih edilen: şeffaf PNG. Arka plan otomatik kaldırılır.
                </div>
              </div>

              <label className="inline-flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-black hover:border-neutral-900">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
                Logo Seç ve Yükle
              </label>
            </div>

            {/* chipler */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">PNG</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">JPG</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">PDF</span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                Önerilen: 512px+
              </span>
            </div>
          </div>

          {/* Yüklü dosya kartı */}
          {logoFile ? (
            <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">
                    {logoFile.name}
                  </div>
                  <div className="mt-1 text-xs text-neutral-600">
                    {fileExt(logoFile.name)} • {formatBytes(logoFile.size)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-xs font-medium hover:border-neutral-900"
                    onClick={() => setLogoFile(null)}
                  >
                    Kaldır
                  </button>

                  <label className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-black cursor-pointer">
                    Değiştir
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => acceptFile(e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-xs text-neutral-600">
              JPG, PNG veya PDF formatında logo yükleyin
            </div>
          )}
        </div>

        {/* SAĞ: Preview */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-black">Önizleme</div>
          <div className="mt-4">
            <Logo3DPreview file={logoFile} />
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
