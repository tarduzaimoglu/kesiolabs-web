"use client";

import { useState } from "react";
import { renderBlocks } from "@/lib/strapi-main";

type Faq = {
  id: number;
  question: string;
  answer?: any;
};

export default function FaqAccordion({ title, faqs }: { title?: string; faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs?.[0]?.id ?? null);

  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <section className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 pb-14 md:pb-20">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">
            {title || "Üretim Süreci Hakkında"}
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-600">
            Sipariş ve üretim süreciyle ilgili en sık sorulan soruların yanıtlarını burada
            bulabilirsiniz.
          </p>
        </div>

        <div className="mt-8 mx-auto max-w-4xl rounded-2xl border border-slate-200 overflow-hidden">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div key={f.id} className="border-b last:border-b-0 border-slate-200">
                <button
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50"
                >
                  <span className="font-medium text-slate-900">{f.question}</span>
                  <span className="text-slate-500">{isOpen ? "▲" : "▼"}</span>
                </button>

                {isOpen ? (
                  <div className="px-5 pb-5">{renderBlocks(f.answer)}</div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
