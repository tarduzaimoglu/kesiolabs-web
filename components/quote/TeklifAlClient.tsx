"use client";

import HowItWorksVideo from "./HowItWorksVideo";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import UploadCard from "./UploadCard";
import { UploadErrors } from "./errors";
import { calcPricing } from "@/lib/quote/pricing";
import { MATERIALS, MIN_TOTAL_TRY, type MaterialKey } from "@/lib/quote/constants";
import { buildWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/quote/whatsapp";
import { AlertCircle, Calculator, Settings2, Package, Banknote } from "lucide-react";

const StlScene = dynamic(() => import("./stl/StlScene"), { ssr: false });

const COLORS = [
  "#000000", "#ffffff", "#ff3b3b", "#ffaa00", "#1e90ff", "#8a2be2",
  "#00c2a8", "#ff5aa5", "#7c3aed", "#22c55e", "#ef4444", "#f97316",
  "#0ea5e9", "#a3a3a3", "#f5d0fe", "#fde047", "#fb7185", "#14b8a6",
];

type Props = {
  howItWorksTitle?: string;
  howItWorksVideoUrl?: string | null;
};

export default function TeklifAlClient({ howItWorksTitle, howItWorksVideoUrl }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ volumeMM3: number; saMM2: number; sahMM2: number } | null>(null);

  const [material, setMaterial] = useState<MaterialKey>("PLA");
  const [colorHex, setColorHex] = useState("#000000");
  const [infillPct, setInfillPct] = useState(20);
  const [qty, setQty] = useState(1);

  const [isPickingFile, setIsPickingFile] = useState(false);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        setIsPickingFile(false);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const pricing = useMemo(() => {
    return calcPricing({ metrics, material, colorHex, infillPct, qty });
  }, [metrics, material, colorHex, infillPct, qty]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(WHATSAPP_DEFAULT_MESSAGE), []);

  function clearFile() {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(null);
    setFileName(null);
    setMetrics(null);
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 overflow-x-hidden relative font-sans">
      {/* Arka Plan Işık Efektleri */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 py-10 md:py-16">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-md">
            Modelinizi Yükleyin, <span className="text-indigo-400">Üretimi Planlayalım</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-400 max-w-3xl">
            STL dosyanızı yükleyerek malzeme, renk ve üretim detaylarını belirleyin. 
            Baskı için <strong className="text-indigo-300 font-semibold">tahmini maliyeti</strong> anında görüntüleyin.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-12">
          
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-5 min-w-0">
            <UploadCard
              onPickStart={() => setIsPickingFile(true)}
              onPickEnd={() => setIsPickingFile(false)}
              onFileAccepted={(file) => {
                setErrorCode(null);
                clearFile();
                const url = URL.createObjectURL(file);
                setFileUrl(url);
                setFileName(file.name);
              }}
              onClear={clearFile}
              fileName={fileName}
              errorCode={errorCode}
              setErrorCode={setErrorCode}
            />

            <div className="rounded-3xl bg-white/[0.02] p-6 md:p-8 border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Üretim Detayları</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Malzeme</label>
                  <select
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as MaterialKey)}
                  >
                    {Object.keys(MATERIALS).map((k) => (
                      <option key={k} value={k} className="bg-[#0b1120] text-white">{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Renk</label>
                  <div className="flex flex-wrap gap-2.5">
                    {COLORS.map((c) => {
                      const selected = c.toLowerCase() === colorHex.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColorHex(c)}
                          className={`h-9 w-9 rounded-full transition-all duration-300 shrink-0 shadow-lg
                            ${selected 
                              ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#0b1120] scale-110" 
                              : "ring-1 ring-white/10 hover:scale-110 hover:ring-white/30"}`}
                          style={{ background: c }}
                          aria-label={`Renk ${c}`}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Siyah ve beyaz harici renklerde renkli filament farkı uygulanır.
                  </p>
                </div>

                <div>
                  <label className="flex justify-between items-center text-sm font-semibold text-slate-300 mb-2">
                    <span>İç Doluluk</span>
                    <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">%{infillPct}</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={infillPct}
                    onChange={(e) => setInfillPct(Number(e.target.value))}
                    className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="mt-2 text-xs text-slate-500">Dayanım ve ağırlığı etkiler.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Adet</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="h-11 w-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition-colors"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                      className="h-11 w-24 rounded-xl border border-white/10 bg-black/20 px-3 text-center text-sm text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      className="h-11 w-11 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition-colors"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {errorCode && (
                <div className="mt-6 rounded-2xl bg-rose-500/10 p-4 border border-rose-500/20 flex gap-3 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rose-400">
                      {UploadErrors[errorCode]?.title ?? UploadErrors.UNKNOWN.title}
                    </p>
                    <p className="mt-1 text-[13px] text-rose-400/80">
                      {UploadErrors[errorCode]?.message ?? UploadErrors.UNKNOWN.message}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {!isPickingFile && (
              <HowItWorksVideo
                title={howItWorksTitle}
                videoUrl={howItWorksVideoUrl ?? null}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 lg:col-span-7 min-w-0">
            
            {/* 3D Preview */}
            <div className="rounded-3xl bg-white/[0.02] p-6 border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white">3D Model Önizleme</h2>
                <p className="text-sm text-slate-400 mt-1">Model yüklendiğinde burada önizlemesini görebilirsiniz.</p>
              </div>

              {!isPickingFile ? (
                <div className="aspect-[4/3] md:aspect-video lg:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5 relative">
                  {fileUrl ? (
                    <StlScene
                      fileUrl={fileUrl}
                      colorHex={colorHex}
                      onMetrics={(m) => {
                        setErrorCode(null);
                        setMetrics(m);
                      }}
                      onError={(code) => setErrorCode(code)}
                    />
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      <Package className="w-12 h-12 mb-3 text-slate-600 opacity-50" />
                      STL yükleyince model uzayda burada görünecek.
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5 flex items-center justify-center text-sm text-slate-500">
                  Dosya seçiliyor…
                </div>
              )}
            </div>

            {/* Pricing Details */}
            <div className="rounded-3xl bg-white/[0.02] p-6 md:p-8 border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">Tahmini Üretim Bedeli</h2>
              </div>

              <div className="rounded-2xl bg-indigo-500/10 p-5 md:p-6 border border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex items-end justify-between gap-3 relative z-10">
                  <div>
                    <p className="text-sm font-semibold text-indigo-300">Toplam Tahmini Fiyat</p>
                    <p className="mt-1 text-4xl font-black tracking-tight text-white">
                      ₺{pricing.finalTotalTRY.toFixed(2)}
                    </p>
                    {pricing.minimumApplied && (
                      <span className="mt-3 inline-block rounded-full bg-orange-500/20 border border-orange-500/30 px-3 py-1 text-xs font-semibold text-orange-400">
                        Minimum üretim bedeli uygulandı (₺{MIN_TOTAL_TRY.toFixed(2)})
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-indigo-300">Adet</p>
                    <p className="mt-1 text-2xl font-extrabold text-white">{qty}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 text-sm md:grid-cols-2">
                <div className="rounded-2xl bg-black/20 p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Tahmini Ağırlık</p>
                  <p className="mt-1.5 text-lg font-bold text-white">
                    {pricing.weightG > 0 ? `${pricing.weightG.toFixed(1)} g` : "—"}
                  </p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4 border border-white/5 flex flex-col justify-center">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Gram Fiyatı</p>
                  <p className="mt-1.5 text-lg font-bold text-white">
                    {material} · ₺{pricing.gramPriceUsed.toFixed(2)} / g
                  </p>
                  {pricing.colorFactorApplied && (
                    <p className="mt-1 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded w-fit">
                      Renkli filament farkı dahil
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-black/20 p-4 text-sm border border-white/5">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Üretim Ayarları</p>
                <p className="mt-1.5 font-medium text-slate-200">
                  {material} · %{infillPct} iç doluluk ·{" "}
                  {colorHex.toLowerCase() === "#000000" ? "Siyah" : colorHex.toLowerCase() === "#ffffff" ? "Beyaz" : "Renkli"}
                </p>
              </div>

              <p className="mt-6 text-[13px] text-slate-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Fiyatlar ön bilgilendirme amaçlıdır. Üretim öncesi kontrol sonrası netleştirilir.
              </p>
            </div>

            {/* Information & WhatsApp */}
            <div className="rounded-3xl bg-white/[0.02] p-6 md:p-8 border border-white/10 shadow-lg backdrop-blur-md">
              <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                <ul className="list-disc space-y-2 pl-5 text-sm text-slate-400">
                  <li>Fiyatlar yaklaşık değerlerdir; üretim öncesi kontrol sonrası değişiklik gösterebilir.</li>
                  <li>Yalnızca <strong className="text-white">.STL</strong> formatındaki dosyalar desteklenmektedir.</li>
                  <li>Malzeme türü, doluluk oranı, model hacmi ve baskı süresi fiyatı etkiler.</li>
                </ul>

                <a
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:bg-[#20b958] hover:scale-105 hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all duration-300"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp ile Üretimi Netleştir
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
