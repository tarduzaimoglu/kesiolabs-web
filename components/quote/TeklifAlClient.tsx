"use client";
import HowItWorksVideo from "./HowItWorksVideo";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import UploadCard from "./UploadCard";
import { UploadErrors } from "./errors";

import { calcPricing } from "@/lib/quote/pricing";
import { MATERIALS, MIN_TOTAL_TRY, type MaterialKey } from "@/lib/quote/constants";
import { buildWhatsAppUrl, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/quote/whatsapp";

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

  // ✅ iOS picker sırasında ağır şeyleri unmount etmek için
  const [isPickingFile, setIsPickingFile] = useState(false);

  // ✅ picker'dan geri dönünce (cancel bile etse) yakalamak için
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
    <div className="min-h-screen bg-white text-neutral-900 overflow-x-hidden">
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="w-full rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight md:text-[34px]">
              Modelinizi Yükleyin, Üretimi Planlayalım
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              STL dosyanızı yükleyerek malzeme, renk ve üretim detaylarını belirleyin.
              Baskı için <span className="font-semibold">tahmini maliyeti</span> anında görüntüleyin.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT */}
            <div className="space-y-6 min-w-0">
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

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <h2 className="text-base font-semibold">Üretim Detayları</h2>
                <p className="mt-1 text-sm text-neutral-600">Seçimleriniz tahmini fiyatı etkiler.</p>

                <label className="mt-4 block text-sm font-semibold">Malzeme</label>
                <select
                  className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as MaterialKey)}
                >
                  {Object.keys(MATERIALS).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>

                <label className="mt-4 block text-sm font-semibold">Renk</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {COLORS.map((c) => {
                    const selected = c.toLowerCase() === colorHex.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColorHex(c)}
                        className={[
                          "h-8 w-8 rounded-full ring-1 ring-black/10 transition shrink-0",
                          selected
                            ? "outline outline-2 outline-offset-2 outline-orange-500"
                            : "hover:scale-[1.02]",
                        ].join(" ")}
                        style={{ background: c }}
                        aria-label={`Renk ${c}`}
                      />
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-neutral-600">
                  Siyah ve beyaz harici renklerde renkli filament farkı uygulanır.
                </p>

                <label className="mt-4 block text-sm font-semibold">
                  İç Doluluk <span className="text-neutral-500">({infillPct}%)</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={infillPct}
                  onChange={(e) => setInfillPct(Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <p className="mt-1 text-xs text-neutral-600">Dayanım ve ağırlığı etkiler.</p>

                <label className="mt-4 block text-sm font-semibold">Adet</label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-lg font-semibold hover:bg-neutral-50"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
                    className="h-10 w-20 rounded-xl border border-neutral-200 bg-white px-3 text-center text-sm text-neutral-900 outline-none focus:border-neutral-400"
                  />
                  <button
                    type="button"
                    className="h-10 w-10 rounded-xl border border-neutral-300 bg-white text-neutral-900 text-lg font-semibold hover:bg-neutral-50"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {errorCode && (
                <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100">
                  <p className="text-sm font-semibold text-red-900">
                    {UploadErrors[errorCode]?.title ?? UploadErrors.UNKNOWN.title}
                  </p>
                  <p className="mt-1 text-sm text-red-800">
                    {UploadErrors[errorCode]?.message ?? UploadErrors.UNKNOWN.message}
                  </p>
                </div>
              )}

              {/* ✅ iOS picker sırasında videoyu unmount et */}
              {!isPickingFile && (
                <HowItWorksVideo
                  title={howItWorksTitle}
                  videoUrl={howItWorksVideoUrl ?? null}
                />
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6 min-w-0">
              <div className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur">
                <div className="mb-3">
                  <h2 className="text-base font-semibold">3D Model Önizleme</h2>
                  <p className="text-sm text-neutral-600">Model yüklendiğinde burada önizlemesini görebilirsiniz.</p>
                </div>

                {/* ✅ iOS picker sırasında Canvas'ı unmount et */}
                {!isPickingFile ? (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-100 to-neutral-200">
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
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-neutral-600">
                        STL yükleyince model burada görünecek.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 flex items-center justify-center text-sm text-neutral-600">
                    Dosya seçiliyor…
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <h2 className="text-base font-semibold">Tahmini Üretim Bedeli</h2>

                <div className="mt-4 rounded-2xl bg-neutral-50 p-4 ring-1 ring-black/5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-700">Toplam Tahmini Fiyat</p>
                      <p className="mt-1 text-3xl font-black tracking-tight text-neutral-900">
                        ₺{pricing.finalTotalTRY.toFixed(2)}
                      </p>
                      {pricing.minimumApplied && (
                        <span className="mt-2 inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
                          Minimum üretim bedeli uygulandı (₺{MIN_TOTAL_TRY.toFixed(2)})
                        </span>
                      )}
                    </div>
                    <div className="text-right text-sm text-neutral-700">
                      <p className="font-semibold">Adet</p>
                      <p className="mt-1 text-lg font-extrabold text-neutral-900">{qty}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                      <p className="text-neutral-600">Tahmini Ağırlık</p>
                      <p className="mt-1 font-extrabold text-neutral-900">
                        {pricing.weightG > 0 ? `${pricing.weightG.toFixed(1)} g` : "—"}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                      <p className="text-neutral-600">Gram Fiyatı</p>
                      <p className="mt-1 font-extrabold text-neutral-900">
                        {material} · ₺{pricing.gramPriceUsed.toFixed(2)} / g
                      </p>
                      {pricing.colorFactorApplied && (
                        <p className="mt-1 text-xs font-semibold text-neutral-600">
                          Renkli filament farkı uygulandı
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-white p-3 text-sm ring-1 ring-black/5">
                    <p className="text-neutral-600">Üretim Ayarları</p>
                    <p className="mt-1 font-semibold text-neutral-900">
                      {material} · %{infillPct} iç doluluk ·{" "}
                      {colorHex.toLowerCase() === "#000000"
                        ? "Siyah"
                        : colorHex.toLowerCase() === "#ffffff"
                        ? "Beyaz"
                        : "Renkli"}
                    </p>
                  </div>

                  <p className="mt-4 text-xs text-neutral-600">
                    Fiyatlar ön bilgilendirme amaçlıdır. Üretim öncesi kontrol sonrası netleştirilir.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
                    <li>Fiyatlar yaklaşık değerlerdir; üretim öncesi kontrol sonrası değişiklik gösterebilir.</li>
                    <li>Yalnızca <b>.STL</b> formatındaki dosyalar desteklenmektedir.</li>
                    <li>Malzeme türü, doluluk oranı, model hacmi ve baskı süresi fiyatı etkiler.</li>
                  </ul>

                  <a
                    className="inline-flex items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-95"
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
    </div>
  );
}
