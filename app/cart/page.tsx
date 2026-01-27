"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import {
  useCart,
  CART_MIN_QTY,
  CART_MAX_QTY,
  CART_STEP,
} from "@/components/cart/CartContext";

const WHATSAPP_PHONE = "905537538182"; // +90 553 753 81 82
const VAT_RATE = 0.2;

// ✅ Kargo kuralı
const FREE_SHIPPING_THRESHOLD = 1500; // TL

const formatTry = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return CART_MIN_QTY;
  const rounded = Math.round(qty / CART_STEP) * CART_STEP; // 20'nin katı
  return Math.min(CART_MAX_QTY, Math.max(CART_MIN_QTY, rounded));
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPrintableHtml(payload: {
  items: Array<{
    title: string;
    qty: number;
    unitBase: number;
    unitEffective: number;
    discountPerUnit: number;
    total: number;
  }>;
  subtotal: number;
  vat: number;
  grandTotal: number;
  savings: number;
  shippingText: string;
  freeShippingHint?: string;
}) {
  const now = new Date();
  const dateStr = now.toLocaleString("tr-TR");

  const rows = payload.items
    .map((x) => {
      const hasDiscount = x.discountPerUnit > 0;
      return `
      <tr>
        <td>${escapeHtml(x.title)}</td>
        <td style="text-align:right;">${x.qty}</td>
        <td style="text-align:right;">
          ${
            hasDiscount
              ? `${escapeHtml(formatTry(x.unitEffective))}<br/><span style="color:#64748b;font-size:11px;text-decoration:line-through;">${escapeHtml(
                  formatTry(x.unitBase)
                )}</span>`
              : `${escapeHtml(formatTry(x.unitBase))}`
          }
        </td>
        <td style="text-align:right;">${escapeHtml(formatTry(x.total))}</td>
      </tr>`;
    })
    .join("");

  const hintLine = payload.freeShippingHint
    ? `<div class="row"><span>Ücretsiz kargo</span><span>${escapeHtml(payload.freeShippingHint)}</span></div>`
    : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="color-scheme" content="light" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>KesioLabs - Sepet Özeti</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#0f172a;background:#fff}
    h1{margin:0 0 4px;font-size:22px}
    .meta{margin:0 0 18px;color:#334155;font-size:12px}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{border:1px solid #e2e8f0;padding:10px;font-size:12px;vertical-align:top}
    th{background:#f8fafc;text-align:left}
    .totals{margin-top:14px;display:flex;justify-content:flex-end}
    .box{width:360px;border:1px solid #e2e8f0;border-radius:10px;padding:12px}
    .row{display:flex;justify-content:space-between;font-size:12px;padding:6px 0}
    .sep{height:1px;background:#e2e8f0;margin:6px 0}
    .big{font-size:14px;font-weight:700}
    .save{color:#047857;font-weight:700}
    .note{margin-top:12px;color:#475569;font-size:11px}
    @media print { body{padding:18px} }
  </style>
</head>
<body>
  <h1>KesioLabs - Sepet Özeti</h1>
  <p class="meta">Tarih: ${escapeHtml(dateStr)}</p>

  <table>
    <thead>
      <tr>
        <th>Ürün</th>
        <th style="text-align:right;">Adet</th>
        <th style="text-align:right;">Birim</th>
        <th style="text-align:right;">Satır Toplam</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="totals">
    <div class="box">
      <div class="row"><span>Ara Toplam (indirimli)</span><span><b>${escapeHtml(formatTry(payload.subtotal))}</b></span></div>
      <div class="row"><span>%20 KDV</span><span><b>${escapeHtml(formatTry(payload.vat))}</b></span></div>
      <div class="row"><span>İndirim Kazancı</span><span class="save">${escapeHtml(formatTry(payload.savings))}</span></div>
      <div class="row"><span>Kargo</span><span><b>${escapeHtml(payload.shippingText)}</b></span></div>
      ${hintLine}
      <div class="sep"></div>
      <div class="row big"><span>Genel Toplam</span><span>${escapeHtml(formatTry(payload.grandTotal))}</span></div>
    </div>
  </div>

  <div class="note">
    Not: Bu belge otomatik olarak oluşturulmuştur.
  </div>
</body>
</html>`;
}

export default function CartPage() {
  const {
    items,
    qtyCount,
    clear,
    setQty,
    inc,
    dec,
    remove,

    unitPriceOf,
    discountPerUnitOf,
    effectiveUnitPriceOf,
    lineTotalOf,
    cartTotal,
  } = useCart();

  // ✅ input draft: kullanıcı yazarken serbest
  const [qtyDraft, setQtyDraft] = React.useState<Record<string, string>>({});

  const varietyCount = items.length;

  const mapped = items.map((it) => {
    const id = it.id;
    const title = it.product?.title ?? "Ürün";
    const qty = Number(it.qty ?? CART_MIN_QTY);

    const unitBase = unitPriceOf(id);
    const disc = discountPerUnitOf(id);
    const unitEffective = effectiveUnitPriceOf(id);
    const total = lineTotalOf(id);

    return { id, title, qty, unitBase, discountPerUnit: disc, unitEffective, total };
  });

  // ✅ Ara toplam indirimli (KDV hariç) -> kargo eşiğini bunun üzerinden uyguluyoruz
  const subtotal = cartTotal;
  const vat = subtotal * VAT_RATE;
  const grandTotal = subtotal + vat;

  const undiscountedSubtotal = mapped.reduce((sum, x) => sum + x.unitBase * x.qty, 0);
  const savings = Math.max(0, undiscountedSubtotal - subtotal);

  // ✅ Kargo metni + ücretsiz kargoya kalan tutar
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const shippingText = isFreeShipping ? "Ücretsiz" : "Hesaplanacak";

  const freeShippingHint = isFreeShipping
    ? "Koşul sağlandı"
    : `${formatTry(remainingForFree)} daha ekle`;

  // progress bar için 0..1
  const freeShipProgress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);

  const handleContinue = () => {
    if (items.length === 0) return;

    const html = buildPrintableHtml({
      items: mapped,
      subtotal,
      vat,
      grandTotal,
      savings,
      shippingText,
      freeShippingHint: isFreeShipping ? undefined : freeShippingHint,
    });

    const w = window.open("", "_blank", "width=900,height=700");
    if (w) {
      w.document.open();
      w.document.write(html);
      w.document.close();
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch {}
      }, 250);
    }

    const lines = mapped
      .map((x, i) => {
        const hasDisc = x.discountPerUnit > 0;
        const unitText = hasDisc
          ? `${formatTry(x.unitEffective)} (indirimli) | ${formatTry(x.unitBase)} (liste)`
          : `${formatTry(x.unitBase)}`;
        return `${i + 1}) ${x.title} — ${x.qty} adet — Birim: ${unitText} — Satır: ${formatTry(
          x.total
        )}`;
      })
      .join("\n");

    const shippingLine = isFreeShipping
      ? `Kargo: Ücretsiz`
      : `Kargo: Hesaplanacak (Ücretsiz kargo için +${formatTry(remainingForFree)})`;

    const message =
      `Merhaba, sepet özetimi iletiyorum.\n\n` +
      `${lines}\n\n` +
      `Ara Toplam (indirimli): ${formatTry(subtotal)}\n` +
      `%20 KDV: ${formatTry(vat)}\n` +
      `İndirim Kazancı: ${formatTry(savings)}\n` +
      `Genel Toplam: ${formatTry(grandTotal)}\n` +
      `${shippingLine}\n\n` +
      `Not: PDF dosyasını bu mesaja ek olarak göndereceğim.`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 bg-white text-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Sepet</h1>

          <div className="mt-2 text-slate-700">
            Sepette toplam{" "}
            <span className="font-semibold">{varietyCount}</span> çeşit üründen{" "}
            <span className="font-semibold">{qtyCount}</span> adet var.
          </div>
        </div>

        {items.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="h-11 rounded-xl border border-slate-300 px-5 text-sm font-semibold hover:bg-slate-50"
          >
            Sepeti Temizle
          </button>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* SOL: Ürünler + ücretsiz kargo bandı */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-700">
              Sepetiniz şu anda boş.
            </div>
          ) : (
            <>
              {items.map((it) => {
                const id = it.id;
                const title = it.product?.title ?? "Ürün";
                const img =
                  (it.product as any)?.imageUrl ??
                  (it.product as any)?.image ??
                  "/products/placeholder.png";

                const qty = Number(it.qty ?? CART_MIN_QTY);

                const unitBase = unitPriceOf(id);
                const disc = discountPerUnitOf(id);
                const unitEffective = effectiveUnitPriceOf(id);
                const rowTotal = lineTotalOf(id);

                const hasDisc = disc > 0;

                // ✅ kullanıcı yazarken draft kullan
                const draft = qtyDraft[id];
                const inputValue = draft ?? String(qty);

                const clearDraft = () =>
                  setQtyDraft((prev) => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                  });

                return (
                  <div key={id} className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={title}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div>
                          <div className="text-[16px] font-semibold">{title}</div>

                          <div className="mt-1 text-[13px] text-slate-700">
                            Birim:{" "}
                            <span className="font-semibold">
                              {formatTry(unitEffective)}/adet
                            </span>
                            {hasDisc ? (
                              <>
                                {" "}
                                <span className="ml-2 text-[12px] text-slate-500 line-through">
                                  {formatTry(unitBase)}/adet
                                </span>
                                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  −{formatTry(disc)}/adet
                                </span>
                              </>
                            ) : null}
                          </div>

                          <div className="mt-1 text-[12px] text-slate-500">
                            Min: <span className="font-medium">{CART_MIN_QTY}</span>
                            {" • "}Max: <span className="font-medium">{CART_MAX_QTY}</span>
                            {" • "}Adım: <span className="font-medium">{CART_STEP}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[13px] text-slate-600">Satır Toplam</div>
                        <div className="text-[20px] font-semibold">{formatTry(rowTotal)}</div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          className="h-10 w-10 rounded-xl border border-slate-300 hover:bg-slate-50"
                          onClick={() => {
                            dec(id, CART_STEP);
                            clearDraft();
                          }}
                          aria-label="Azalt"
                        >
                          –
                        </button>

                        <input
                          value={inputValue}
                          onChange={(e) => {
                            // ✅ yazarken clamp yok: sadece rakam
                            const next = e.target.value.replace(/[^\d]/g, "");
                            setQtyDraft((prev) => ({ ...prev, [id]: next }));
                          }}
                          onBlur={() => {
                            const n = Number(inputValue);
                            const next = clampQty(n);
                            setQty(id, next);
                            clearDraft();
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              (e.currentTarget as HTMLInputElement).blur();
                            }
                          }}
                          className="h-10 w-[120px] rounded-xl border border-slate-300 px-3 text-center text-[15px] font-semibold outline-none"
                          inputMode="numeric"
                        />

                        <button
                          type="button"
                          className="h-10 w-10 rounded-xl border border-slate-300 hover:bg-slate-50"
                          onClick={() => {
                            inc(id, CART_STEP);
                            clearDraft();
                          }}
                          aria-label="Arttır"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(id)}
                        className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600"
                        aria-label="Ürünü sepetten sil"
                        title="Sepetten sil"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* ✅ Gri alana: ücretsiz kargo bandı */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-[14px] font-semibold text-slate-900">
                    {isFreeShipping ? "Ücretsiz kargo aktif 🎉" : "Ücretsiz kargoya yaklaştın"}
                  </div>

                  <div className="text-[13px] text-slate-700">
                    {isFreeShipping ? (
                      <>Sepet tutarın {formatTry(subtotal)} — kargo ücreti yansıtılmaz.</>
                    ) : (
                      <>
                        Ücretsiz kargo için{" "}
                        <span className="font-semibold">{formatTry(remainingForFree)}</span>{" "}
                        daha ekle.
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${Math.round(freeShipProgress * 100)}%` }}
                  />
                </div>

                <div className="mt-2 text-[12px] text-slate-500">
                  Ücretsiz kargo eşiği: <span className="font-medium">{formatTry(FREE_SHIPPING_THRESHOLD)}</span>{" "}
                  (Ara toplam üzerinden hesaplanır.)
                </div>
              </div>
            </>
          )}
        </div>

        {/* SAĞ: Özet */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24 flex flex-col">
          <div className="text-[18px] font-semibold">Özet</div>

          <div className="mt-5 space-y-3 text-[14px]">
            <div className="flex items-center justify-between">
              <div className="text-slate-700">Ara toplam (indirimli)</div>
              <div className="font-semibold">{formatTry(subtotal)}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-slate-700">%20 KDV</div>
              <div className="font-semibold">{formatTry(vat)}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-slate-700">İndirim kazancı</div>
              <div className="font-semibold text-emerald-700">{formatTry(savings)}</div>
            </div>

            <div className="h-px w-full bg-slate-200" />

            <div className="flex items-center justify-between">
              <div className="text-slate-900 font-semibold">Genel toplam</div>
              <div className="font-bold">{formatTry(grandTotal)}</div>
            </div>

            {/* ✅ KARGO satırı: butondan uzak, düzgün hizalı */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-slate-700">Kargo</div>
              <div className={isFreeShipping ? "font-semibold text-emerald-700" : "font-semibold"}>
                {shippingText}
              </div>
            </div>

            {!isFreeShipping ? (
              <div className="text-[12px] text-slate-500">
                Ücretsiz kargo için{" "}
                <span className="font-semibold text-slate-700">{formatTry(remainingForFree)}</span>{" "}
                daha ekleyebilirsin.
              </div>
            ) : (
              <div className="text-[12px] text-emerald-700">
                Ücretsiz kargo koşulu sağlandı.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="mt-6 h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Devam Et
          </button>

          <div className="mt-4 text-[12px] text-slate-600">
            Not: Adet değişiklikleri {CART_STEP}&apos;nin katları olacak şekilde uygulanır.
          </div>
        </div>
      </div>
    </main>
  );
}
