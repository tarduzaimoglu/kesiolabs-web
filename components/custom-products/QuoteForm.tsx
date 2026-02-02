"use client";

import React, { useMemo, useState } from "react";
import Logo3DPreview from "./Logo3DPreview";

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
    if (!selectedTypes?.length) return "—";
    return selectedTypes
      .map((x) => (x.title ?? x.label ?? "").trim())
      .filter(Boolean)
      .join(", ");
  }, [selectedTypes]);

  const canSend =
    accepted &&
    selectedTypes.length > 0 &&
    name.trim() &&
    company.trim() &&
    phone.trim() &&
    email.trim() &&
    !isSending;

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

      setStatusMsg("Talebiniz alındı. En kısa sürede dönüş yapacağız.");
      // istersen form reset:
      // setName(""); setCompany(""); setPhone(""); setEmail(""); setNote("");
      // setAccepted(false);
    } catch (e: any) {
      setStatusMsg(e?.message || "Bir hata oluştu.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="text-lg font-semibold text-black">Teklif Formu</div>
      {logoFile ? (
  <div className="mt-4">
    <div className="text-sm font-medium text-neutral-700">Logo Önizleme</div>
    <div className="mt-2">
      <Logo3DPreview file={logoFile} />
    </div>
  </div>
) : null}

      <div className="mt-4">
        <label className="text-sm font-medium text-neutral-700">
          Seçilen Ürün Türleri
        </label>
        <div className="mt-2 rounded-xl border border-neutral-200 bg-orange-50 px-4 py-3 text-sm text-neutral-800">
          {selectedLabelText}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <input
          className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm"
          placeholder="Adınız"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm"
          placeholder="Firmanız"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm"
          placeholder="Telefon Numaranız"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="h-11 w-full rounded-xl border border-neutral-200 px-4 text-sm"
          placeholder="E-Posta Adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="min-h-[110px] w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          placeholder="Not (opsiyonel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <label className="mt-4 flex items-start gap-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-1"
        />
        Paylaştığım bilgilerin, Gizlilik Politikası kapsamında fiyat teklifi
        oluşturulması amacıyla işlenmesini kabul ediyorum.
      </label>

      {statusMsg ? (
        <div className="mt-3 text-sm text-neutral-700">{statusMsg}</div>
      ) : null}

      <button
        type="button"
        disabled={!canSend}
        onClick={onSubmit}
        className={[
          "mt-4 h-10 rounded-xl px-4 text-sm font-medium",
          canSend
            ? "bg-neutral-900 text-white hover:bg-neutral-800"
            : "bg-neutral-200 text-neutral-500",
        ].join(" ")}
      >
        {isSending ? "Gönderiliyor..." : "Formu Gönder"}
      </button>
    </div>
  );
}
