"use client";

import React, { useMemo, useState } from "react";
import Logo3DPreview from "./Logo3DPreview";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

type CustomType = {
  id: string;
  title?: string;
  label?: string;
  imageUrl: string;
};

export function QuoteForm({
  selectedTypes,
  logoFile,
}: {
  selectedTypes: CustomType[];
  logoFile: File | null;
}) {
  const [accepted, setAccepted] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const selectedLabelText = useMemo(() => {
    if (!selectedTypes?.length) return "Henüz ürün seçilmedi";
    return selectedTypes
      .map((x) => (x.title ?? x.label ?? "").trim())
      .filter(Boolean)
      .join(", ");
  }, [selectedTypes]);

  const canSend = accepted && selectedTypes.length > 0 && name.trim() && company.trim() && phone.trim() && email.trim() && !isSending;

  const onSubmit = async () => {
    setStatusMsg(null);
    setIsSending(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("company", company);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("note", note);
      fd.append("selectedTypes", selectedLabelText);
      if (logoFile) fd.append("logo", logoFile);

      const res = await fetch("/api/custom-products/quote", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Mail gönderilemedi.");
      }

      setStatusMsg("SUCCESS");
    } catch (e: any) {
      setStatusMsg(e?.message || "Bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Arka plan ışıltısı */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="text-2xl font-bold text-white mb-8">4. Teklif Formu</div>

      {statusMsg === "SUCCESS" ? (
        <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Talebiniz Alındı!</h3>
          <p className="text-slate-400">Üretim ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-2">Seçilen Ürün Türleri</label>
              <div className={`rounded-xl border px-4 py-3 text-sm transition-colors ${selectedTypes.length > 0 ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-300" : "border-white/10 bg-black/20 text-slate-500"}`}>
                {selectedLabelText}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2 uppercase tracking-wider">Adınız Soyadınız</label>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Örn: Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2 uppercase tracking-wider">Firma Adı</label>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Örn: KesioLabs"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2 uppercase tracking-wider">Telefon Numarası</label>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="05XX XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-2 uppercase tracking-wider">E-Posta Adresi</label>
                <input
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="ornek@firma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2 uppercase tracking-wider">Ek Notlarınız (Opsiyonel)</label>
              <textarea
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y"
                placeholder="Özel isteklerinizi veya projeniz hakkındaki detayları buraya yazabilirsiniz..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-400 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black/20 checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
                />
                <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="group-hover:text-slate-300 transition-colors">
                Paylaştığım bilgilerin, Gizlilik Politikası kapsamında fiyat teklifi oluşturulması amacıyla işlenmesini kabul ediyorum.
              </span>
            </label>

            {statusMsg && statusMsg !== "SUCCESS" && (
              <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {statusMsg}
              </div>
            )}

            <button
              type="button"
              disabled={!canSend}
              onClick={onSubmit}
              className={`w-full md:w-auto mt-4 h-14 rounded-xl px-8 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300
                ${canSend
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
                  : "bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed"}
              `}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Teklif İsteyin
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
