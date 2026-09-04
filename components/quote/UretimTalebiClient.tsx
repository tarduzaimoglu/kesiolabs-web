"use client";

import dynamic from "next/dynamic";
import { FormEvent, useCallback, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, DraftingCompass, Loader2, MessageCircle, Package, Send, Settings2 } from "lucide-react";
import UploadCard from "./UploadCard";
import { UploadErrors } from "./errors";
import { MATERIALS, type MaterialKey } from "@/lib/quote/constants";
import { buildWhatsAppUrl } from "@/lib/quote/whatsapp";

const StlScene = dynamic(() => import("./stl/StlScene"), { ssr: false });

const COLORS = ["#000000", "#ffffff", "#ef4444", "#f59e0b", "#2563eb", "#7c3aed", "#14b8a6", "#ec4899", "#22c55e", "#a3a3a3"];
const inputClass = "w-full border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#DA291C] disabled:opacity-50";

type Mode = "model" | "design";
type Analysis = {
  metrics: { volumeMM3: number; saMM2: number; sahMM2: number };
  bounds: { width: number; height: number; depth: number };
};

function colorName(value: string) {
  if (value === "#000000") return "Siyah";
  if (value === "#ffffff") return "Beyaz";
  return value.toUpperCase();
}

export default function UretimTalebiClient() {
  const [mode, setMode] = useState<Mode>("model");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [material, setMaterial] = useState<MaterialKey>("PLA");
  const [colorHex, setColorHex] = useState("#000000");
  const [infillPct, setInfillPct] = useState(20);
  const [qty, setQty] = useState(1);
  const [projectType, setProjectType] = useState("Yeni ürün / parça tasarımı");
  const [projectDescription, setProjectDescription] = useState("");
  const [approximateDimensions, setApproximateDimensions] = useState("");
  const [materialExpectation, setMaterialExpectation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const clearFile = useCallback(() => {
    setFileUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setFileName(null);
    setAnalysis(null);
  }, []);

  const handleAnalysis = useCallback((result: Analysis) => {
    setErrorCode(null);
    setAnalysis(result);
  }, []);

  const solidWeight = analysis ? (analysis.metrics.volumeMM3 / 1000) * MATERIALS[material].density : null;
  const dimensions = analysis
    ? `${analysis.bounds.width.toFixed(1)} × ${analysis.bounds.depth.toFixed(1)} × ${analysis.bounds.height.toFixed(1)} mm`
    : null;

  const technicalSummary = useMemo(() => {
    if (mode === "design") {
      return [
        "Kesiolabs 3D üretim tasarım desteği talebi",
        `Proje türü: ${projectType}`,
        `Açıklama: ${projectDescription || "Görüşme sırasında paylaşılacak"}`,
        `Yaklaşık ölçüler: ${approximateDimensions || "Belirtilmedi"}`,
        `Adet: ${qty}`,
        `Malzeme beklentisi: ${materialExpectation || "Teknik değerlendirmeye bırakıldı"}`,
        "Üretim süresi teknik inceleme sonrasında paylaşılır.",
      ].join("\n");
    }

    return [
      "Kesiolabs 3D üretim talebi",
      `Dosya: ${fileName || "Henüz seçilmedi"}`,
      `Model ölçüleri: ${dimensions || "Analiz bekleniyor"}`,
      `Yaklaşık katı model ağırlığı: ${solidWeight ? `${solidWeight.toFixed(1)} g` : "Analiz bekleniyor"}`,
      `Malzeme: ${material}`,
      `Renk: ${colorName(colorHex)}`,
      `İç doluluk: %${infillPct}`,
      `Adet: ${qty}`,
      `Proje notu: ${projectDescription || "Belirtilmedi"}`,
      "Üretim süresi teknik inceleme sonrasında paylaşılır.",
    ].join("\n");
  }, [approximateDimensions, colorHex, dimensions, fileName, infillPct, material, materialExpectation, mode, projectDescription, projectType, qty, solidWeight]);

  const whatsappUrl = useMemo(() => buildWhatsAppUrl(`Merhaba,\n\n${technicalSummary}`), [technicalSummary]);

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setFormStatus("idle");
    const fields = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          subject: mode === "model" ? "3D üretim talebi" : "Tasarım ve modelleme desteği talebi",
          message: `${technicalSummary}\n\nİletişim notu: ${String(fields.get("contactNote") || "Belirtilmedi")}`,
        }),
      });
      if (!response.ok) throw new Error("REQUEST_FAILED");
      setFormStatus("success");
      form.reset();
    } catch {
      setFormStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-[#B7B7B7]">
      <section className="border-b border-white/10 bg-[#080808] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#DA291C]">Dijital üretim</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-[-0.045em] text-white md:text-6xl">3D Üretim Talebinizi Teknik İncelemeye Gönderin</h1>
          <p className="mt-6 max-w-3xl text-base leading-8">Hazır STL modelinizi analiz edin veya tasarım ve modelleme desteği ihtiyacınızı paylaşın. Kesiolabs ekibi üretilebilirlik, malzeme ve süreç gereksinimlerini inceleyerek sizinle iletişime geçer.</p>
          <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-2" role="tablist" aria-label="Üretim talebi türü">
            <button type="button" role="tab" aria-selected={mode === "model"} onClick={() => setMode("model")} className={`flex items-center justify-between border px-5 py-4 text-left text-sm font-bold ${mode === "model" ? "border-[#DA291C] bg-[#DA291C] text-white" : "border-white/20 text-white hover:border-white/50"}`}>Modelim Hazır <Package className="h-5 w-5" /></button>
            <button type="button" role="tab" aria-selected={mode === "design"} onClick={() => setMode("design")} className={`flex items-center justify-between border px-5 py-4 text-left text-sm font-bold ${mode === "design" ? "border-[#DA291C] bg-[#DA291C] text-white" : "border-white/20 text-white hover:border-white/50"}`}>Tasarım / Modelleme Desteği <DraftingCompass className="h-5 w-5" /></button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {mode === "model" ? (
          <div className="grid gap-7 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-5">
              <UploadCard
                onFileAccepted={(file) => { clearFile(); setFileUrl(URL.createObjectURL(file)); setFileName(file.name); }}
                onClear={clearFile}
                fileName={fileName}
                errorCode={errorCode}
                setErrorCode={setErrorCode}
              />
              <section className="border border-white/10 bg-white/[0.025] p-6 md:p-8">
                <div className="mb-7 flex items-center gap-3"><Settings2 className="h-5 w-5 text-[#DA291C]" /><h2 className="text-xl font-bold text-white">Üretim Detayları</h2></div>
                <div className="space-y-6">
                  <label className="block text-sm font-semibold text-white">Malzeme<select value={material} onChange={(event) => setMaterial(event.target.value as MaterialKey)} className={`${inputClass} mt-2`}>{Object.keys(MATERIALS).map((key) => <option key={key} value={key} className="bg-black">{key}</option>)}</select></label>
                  <div><p className="text-sm font-semibold text-white">Renk</p><div className="mt-3 flex flex-wrap gap-2.5">{COLORS.map((color) => <button key={color} type="button" aria-label={`Renk ${color}`} onClick={() => setColorHex(color)} className={`h-9 w-9 rounded-full border transition-transform hover:scale-110 ${colorHex === color ? "ring-2 ring-[#DA291C] ring-offset-2 ring-offset-black" : "border-white/20"}`} style={{ backgroundColor: color }} />)}</div></div>
                  <label className="block text-sm font-semibold text-white"><span className="flex justify-between"><span>İç Doluluk</span><span className="text-[#DA291C]">%{infillPct}</span></span><input type="range" min={10} max={50} step={5} value={infillPct} onChange={(event) => setInfillPct(Number(event.target.value))} className="mt-3 w-full accent-[#DA291C]" /></label>
                  <label className="block text-sm font-semibold text-white">Adet<input type="number" min={1} value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value || 1)))} className={`${inputClass} mt-2 max-w-32`} /></label>
                  <label className="block text-sm font-semibold text-white">Proje Notu<textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} className={`${inputClass} mt-2 min-h-28 resize-y`} placeholder="Kullanım amacı veya özel beklentiler" /></label>
                </div>
                {errorCode && <div className="mt-6 flex gap-3 border border-[#DA291C]/50 bg-[#DA291C]/10 p-4 text-sm text-white"><AlertCircle className="h-5 w-5 shrink-0 text-[#DA291C]" /><div><p className="font-bold">{UploadErrors[errorCode]?.title ?? UploadErrors.UNKNOWN.title}</p><p className="mt-1 text-white/65">{UploadErrors[errorCode]?.message ?? UploadErrors.UNKNOWN.message}</p></div></div>}
              </section>
            </div>

            <div className="space-y-7 lg:col-span-7">
              <section className="border border-white/10 bg-white/[0.025] p-6">
                <h2 className="text-xl font-bold text-white">3D Model Önizleme</h2>
                <p className="mt-2 text-sm">STL dosyanız tarayıcınızda işlenir ve burada görüntülenir.</p>
                <div className="relative mt-5 aspect-[4/3] overflow-hidden bg-[#F4F4F4] md:aspect-video lg:aspect-[4/3]">
                  {fileUrl ? <StlScene fileUrl={fileUrl} colorHex={colorHex} onAnalysis={handleAnalysis} onError={setErrorCode} /> : <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-black/40"><Package className="h-12 w-12 stroke-1" /><span className="text-sm font-semibold">Önizleme için bir STL dosyası seçin.</span></div>}
                </div>
              </section>
              <TechnicalSummary fileName={fileName} dimensions={dimensions} solidWeight={solidWeight} material={material} color={colorName(colorHex)} infill={infillPct} quantity={qty} />
              <ContactActions whatsappUrl={whatsappUrl} />
            </div>
          </div>
        ) : (
          <section className="grid gap-10 border border-white/10 bg-white/[0.025] p-6 md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">Tasarım desteği</p><h2 className="mt-4 text-3xl font-bold tracking-tight text-white">Fikrinizi ve kullanım ihtiyacınızı paylaşın</h2><p className="mt-5 leading-7">Teknik çizim veya hazır modeliniz olmasa da kullanım amacı, yaklaşık ölçüler ve adet bilgisiyle süreci başlatabilirsiniz.</p><p className="mt-6 border-l-2 border-[#DA291C] pl-4 text-sm">Üretim yöntemi ve süre, teknik inceleme sonrasında paylaşılır.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-white">Proje Türü<select value={projectType} onChange={(event) => setProjectType(event.target.value)} className={`${inputClass} mt-2`}><option className="bg-black">Yeni ürün / parça tasarımı</option><option className="bg-black">Mevcut parçanın modellenmesi</option><option className="bg-black">Prototip geliştirme</option><option className="bg-black">Kalıp / model odaklı üretim</option><option className="bg-black">Diğer</option></select></label>
              <label className="text-sm font-semibold text-white">Adet<input type="number" min={1} value={qty} onChange={(event) => setQty(Math.max(1, Number(event.target.value || 1)))} className={`${inputClass} mt-2`} /></label>
              <label className="text-sm font-semibold text-white">Yaklaşık Ölçüler<input value={approximateDimensions} onChange={(event) => setApproximateDimensions(event.target.value)} className={`${inputClass} mt-2`} placeholder="Örn. 120 × 80 × 30 mm" /></label>
              <label className="text-sm font-semibold text-white">Malzeme Beklentisi<input value={materialExpectation} onChange={(event) => setMaterialExpectation(event.target.value)} className={`${inputClass} mt-2`} placeholder="Bilmiyorsanız boş bırakabilirsiniz" /></label>
              <label className="text-sm font-semibold text-white sm:col-span-2">Proje Açıklaması<textarea required value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} className={`${inputClass} mt-2 min-h-40 resize-y`} placeholder="Parçanın kullanım amacı, çalışma koşulları ve beklentileriniz" /></label>
              <div className="sm:col-span-2"><ContactActions whatsappUrl={whatsappUrl} /></div>
            </div>
          </section>
        )}

        <section id="talep-formu" className="mt-12 grid gap-9 border-t border-white/15 pt-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div><div className="flex items-center gap-3"><ClipboardList className="h-5 w-5 text-[#DA291C]" /><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#DA291C]">Talep formu</p></div><h2 className="mt-5 text-3xl font-bold text-white">Teknik değerlendirmeye gönderin</h2><p className="mt-5 leading-7">Seçimleriniz ve proje bilgileriniz Kesiolabs ekibine iletilir. Ticari koşullar teknik inceleme sonrasında doğrudan sizinle paylaşılır.</p></div>
          <form onSubmit={submitRequest} className="grid gap-5 border border-white/10 bg-white/[0.025] p-6 sm:grid-cols-2 md:p-8">
            <label className="text-sm font-semibold text-white">Ad Soyad<input required name="name" autoComplete="name" className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-semibold text-white">E-posta<input required type="email" name="email" autoComplete="email" className={`${inputClass} mt-2`} /></label>
            <label className="text-sm font-semibold text-white sm:col-span-2">İletişim Notu<textarea name="contactNote" className={`${inputClass} mt-2 min-h-28 resize-y`} placeholder="Size ulaşmamızı kolaylaştıracak ek bilgi" /></label>
            <div className="sm:col-span-2"><pre className="whitespace-pre-wrap border border-white/10 bg-black/30 p-4 text-xs leading-6 text-white/55">{technicalSummary}</pre></div>
            {formStatus === "success" && <p className="flex items-center gap-2 text-sm text-white sm:col-span-2"><CheckCircle2 className="h-5 w-5 text-[#DA291C]" />Talebiniz teknik değerlendirme için iletildi.</p>}
            {formStatus === "error" && <p className="flex items-center gap-2 text-sm text-[#DA291C] sm:col-span-2"><AlertCircle className="h-5 w-5" />Talep gönderilemedi. Lütfen tekrar deneyin veya WhatsApp üzerinden iletişime geçin.</p>}
            <button disabled={submitting} className="inline-flex items-center justify-center gap-2 bg-[#DA291C] px-6 py-4 text-sm font-bold text-white hover:bg-white hover:text-black disabled:opacity-50 sm:col-span-2 sm:justify-self-start">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{submitting ? "Gönderiliyor" : "Talebi Gönder"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}

function TechnicalSummary({ fileName, dimensions, solidWeight, material, color, infill, quantity }: { fileName: string | null; dimensions: string | null; solidWeight: number | null; material: string; color: string; infill: number; quantity: number }) {
  const items = [
    ["Dosya", fileName || "Henüz seçilmedi"],
    ["Model ölçüleri", dimensions || "Analiz bekleniyor"],
    ["Yaklaşık katı model ağırlığı", solidWeight ? `${solidWeight.toFixed(1)} g` : "Analiz bekleniyor"],
    ["Malzeme", material], ["Renk", color], ["İç doluluk", `%${infill}`], ["Adet", String(quantity)],
  ];
  return <section className="border border-white/10 bg-white/[0.025] p-6 md:p-8"><h2 className="text-xl font-bold text-white">Teknik Özet</h2><dl className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">{items.map(([label, value]) => <div key={label} className="bg-[#0A0A0A] p-4"><dt className="text-xs font-bold uppercase tracking-wider text-white/40">{label}</dt><dd className="mt-2 text-sm font-semibold text-white">{value}</dd></div>)}</dl><p className="mt-5 text-sm">Üretim süresi teknik inceleme sonrasında paylaşılır.</p></section>;
}

function ContactActions({ whatsappUrl }: { whatsappUrl: string }) {
  return <div className="flex flex-col gap-3 sm:flex-row"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-sm font-bold text-white hover:bg-[#20b958]"><MessageCircle className="h-5 w-5" />WhatsApp ile İlet</a><a href="#talep-formu" className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-sm font-bold text-white hover:border-white"><span>Talep Formu ile İlet</span><ArrowRight className="h-4 w-4" /></a></div>;
}
