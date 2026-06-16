"use client";

import React from "react";
import type { CustomProductType } from "@/lib/custom-products/types";
import { Check } from "lucide-react";

type Props = {
  types: CustomProductType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function ProductTypeGrid({ types, selectedIds, onToggle }: Props) {
  const selected = new Set(selectedIds);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {types.map((t) => {
        const isSelected = selected.has(t.id);

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 backdrop-blur-sm
              ${isSelected 
                ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"}
            `}
          >
            {/* Seçildi İkonu (Sağ Üst) */}
            {isSelected && (
              <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                <Check className="w-5 h-5" />
              </div>
            )}

            {/* Görsel */}
            <div className="relative w-full overflow-hidden bg-black/40">
              <div className="aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.imageUrl || "/placeholder.png"}
                  alt={t.title}
                  className={`h-full w-full object-cover transition-transform duration-500 ${isSelected ? "scale-105" : "group-hover:scale-105"}`}
                  loading="lazy"
                  draggable={false}
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${isSelected ? "bg-indigo-900/20" : "bg-transparent group-hover:bg-white/5"}`} />
              </div>
            </div>

            {/* Başlık + Buton */}
            <div className="p-4 md:p-5 flex flex-col items-center">
              <div className={`text-sm font-semibold mb-4 transition-colors ${isSelected ? "text-indigo-300" : "text-white"}`}>
                {t.title}
              </div>

              <div
                className={`w-full rounded-xl py-2.5 text-center text-[13px] font-semibold transition-all duration-300
                  ${isSelected
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white"}
                `}
              >
                {isSelected ? "Seçildi" : "Seç"}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
