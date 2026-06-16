"use client";

import React, { useMemo, useState } from "react";
import { QuoteForm } from "@/components/custom-products/QuoteForm";
import { ProductTypeGrid } from "@/components/custom-products/ProductTypeGrid";
import type { CustomProductType } from "@/lib/custom-products/types";
import Logo3DPreview from "@/components/custom-products/Logo3DPreview";
import { UploadCloud, FileImage, X, RefreshCw } from "lucide-react";

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

    const okTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!okTypes.includes(f.type)) {
      alert("Lütfen PNG, JPG veya PDF yükleyin.");
      return;
    }

    const maxMb = 12;
    if (f.size > maxMb * 1024 * 1024) {
      alert(`Dosya çok büyük. Lütfen ${maxMb}MB altı yükleyin.`);
      return;
    }

    setLogoFile(f);
  };

  return (
    <>
      {/* BAŞLIK ALANI */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          Firmanıza Özel <span className="text-indigo-400">Ürünler</span> Tasarlayın
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
          Logonuzu yükleyin, üretim seçeneklerini belirleyin ve markanıza özel profesyonel teklifinizi anında alın.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* SOL BÖLÜM: DOSYA YÜKLEME */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">1. Logonuzu Yükleyin</h2>

          {/* Mini Bilgi Akışı */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 mx-auto bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-full font-bold text-sm mb-2 border border-indigo-500/30">1</div>
              <div className="text-[13px] font-semibold text-slate-200">Logo Yükle</div>
              <div className="text-[11px] text-slate-500 mt-1">PNG/JPG/PDF</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 mx-auto bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-full font-bold text-sm mb-2 border border-indigo-500/30">2</div>
              <div className="text-[13px] font-semibold text-slate-200">Ürün Seç</div>
              <div className="text-[11px] text-slate-500 mt-1">Sınırsız Seçim</div>
            </div>
            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center">
              <div className="w-8 h-8 mx-auto bg-indigo-500/20 text-indigo-400 flex items-center justify-center rounded-full font-bold text-sm mb-2 border border-indigo-500/30">3</div>
              <div className="text-[13px] font-semibold text-slate-200">Teklif Al</div>
              <div className="text-[11px] text-slate-500 mt-1">Hızlı Dönüş</div>
            </div>
          </div>

          {/* Drag & Drop Alanı */}
          <div
            className={`flex-1 rounded-3xl border-2 border-dashed p-8 md:p-10 transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden group
              ${isDragging ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-white/10 bg-black/20 hover:border-indigo-400/50 hover:bg-white/[0.02]"}`}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; acceptFile(f); }}
          >
            <UploadCloud className={`w-14 h-14 mb-4 transition-colors ${isDragging ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"}`} />
            
            <div className="text-base font-medium text-slate-200">Dosyayı buraya sürükleyip bırakın</div>
            <div className="mt-2 text-[13px] text-slate-500 max-w-xs">
              Şeffaf arka planlı <strong className="text-slate-400">PNG</strong> tavsiye edilir. (Max 12MB)
            </div>

            <label className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/25 cursor-pointer hover:-translate-y-0.5">
              Bilgisayardan Seç
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </label>
          </div>

          {/* Yüklenen Dosya Kartı */}
          {logoFile && (
            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 backdrop-blur-sm flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <FileImage className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white line-clamp-1">{logoFile.name}</div>
                  <div className="mt-1 text-[11px] font-medium text-indigo-300 uppercase tracking-wider">
                    {fileExt(logoFile.name)} • {formatBytes(logoFile.size)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-slate-400 cursor-pointer transition-colors" title="Değiştir">
                  <RefreshCw className="w-4 h-4" />
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" className="hidden" onChange={(e) => acceptFile(e.target.files?.[0])} />
                </label>
                <button type="button" onClick={() => setLogoFile(null)} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 transition-colors" title="Kaldır">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SAĞ BÖLÜM: 3D ÖNİZLEME */}
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-6">2. 3D Önizleme</h2>
          <div className="flex-1 bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none" />
            <Logo3DPreview file={logoFile} />
          </div>
        </div>
      </div>

      {/* ALT BÖLÜM: ÜRÜN SEÇİMİ VE FORM */}
      <section className="mt-24 border-t border-white/10 pt-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">3. Ürün Türü Seçin</h2>
          <p className="mt-3 text-lg text-slate-400">Üretilmesini istediğiniz modelleri aşağıdan belirleyin (Birden fazla seçebilirsiniz).</p>
        </div>

        <div className="relative z-10">
          <ProductTypeGrid types={types} selectedIds={selectedTypeIds} onToggle={toggleType} />
        </div>

        <div className="mt-20 relative z-10 max-w-4xl mx-auto">
          <QuoteForm selectedTypes={selectedTypes} logoFile={logoFile} />
        </div>
      </section>
    </>
  );
}
