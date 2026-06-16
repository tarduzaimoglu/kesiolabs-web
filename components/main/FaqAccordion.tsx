"use client";

import { useState } from "react";
import { renderBlocks } from "@/lib/strapi-main";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";

type Faq = {
  id: number;
  question: string;
  answer?: any;
};

export default function FaqAccordion({ title, faqs }: { title?: string; faqs: Faq[] }) {
  const [openId, setOpenId] = useState<number | null>(faqs?.[0]?.id ?? null);

  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Başlık Alanı */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 mb-6">
            <MessageCircleQuestion className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
            {title || "Üretim Süreci Hakkında"}
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Sipariş ve üretim süreciyle ilgili aklınıza takılan tüm detayların yanıtlarını burada bulabilirsiniz.
          </p>
        </div>

        {/* Akordiyon Listesi */}
        <div className="space-y-4">
          {faqs.map((f) => {
            const isOpen = openId === f.id;
            return (
              <div 
                key={f.id} 
                className={`group rounded-2xl border transition-all duration-300 backdrop-blur-sm overflow-hidden
                  ${isOpen 
                    ? "bg-white/[0.05] border-indigo-500/30 shadow-[0_10px_30px_rgba(99,102,241,0.1)]" 
                    : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20"}
                `}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : f.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left outline-none"
                >
                  <span className={`font-semibold text-[15px] md:text-base transition-colors ${isOpen ? "text-indigo-300" : "text-slate-200 group-hover:text-white"}`}>
                    {f.question}
                  </span>
                  
                  {/* İkon Animasyonu */}
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-white"}`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
                  </div>
                </button>

                {/* Açılır İçerik (Cevap) */}
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pt-2 prose prose-invert prose-slate max-w-none text-slate-400 text-[14px] md:text-[15px] leading-relaxed [&_a]:text-indigo-400 [&_a]:underline hover:[&_a]:text-indigo-300">
                      {renderBlocks(f.answer)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
