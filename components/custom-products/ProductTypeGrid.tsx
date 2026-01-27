"use client";

import React from "react";
import type { CustomProductType } from "@/lib/custom-products/types";

type Props = {
  types: CustomProductType[];
  selectedIds: string[];
  onToggle: (id: string) => void;
};

export function ProductTypeGrid({ types, selectedIds, onToggle }: Props) {
  const selected = new Set(selectedIds);

  return (
    <div
      className="
        grid grid-cols-2 gap-4
        md:grid-cols-4 md:gap-5
      "
    >
      {types.map((t) => {
        const isSelected = selected.has(t.id);

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            className={[
              "group overflow-hidden rounded-2xl border bg-white shadow-sm transition",
              "hover:-translate-y-[1px] hover:shadow-md",
              isSelected ? "border-orange-500 ring-1 ring-orange-200" : "border-neutral-200",
            ].join(" ")}
          >
            {/* Görsel */}
            <div className="relative w-full overflow-hidden bg-neutral-100">
              {/* 4:3 oran – kartlar dengeli dursun */}
              <div className="aspect-[4/3] w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.imageUrl || "/placeholder.png"}
                  alt={t.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Başlık + buton */}
            <div className="px-3 pb-4 pt-3">
              <div className="text-center text-[13px] font-semibold text-black md:text-[14px]">
                {t.title}
              </div>

              <div
                className={[
                  "mt-3 w-full rounded-xl py-2 text-center text-[13px] font-semibold transition",
                  isSelected
                    ? "bg-orange-500 text-white"
                    : "bg-blue-600 text-white group-hover:bg-blue-700",
                ].join(" ")}
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
