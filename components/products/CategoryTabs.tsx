"use client";

import React from "react";

export type CatalogCategoryTab = {
  key: string;
  label: string;
};

export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: CatalogCategoryTab[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="w-full">
      {/* ✅ MOBİL: tek satır, yatay kaydırma */}
      <div className="md:hidden w-full">
        {/* -mx-4 + px-4 => mobilde header/container padding'i ile tam hizalar */}
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
          <div className="inline-flex w-max gap-3 py-2">
            {categories.map((c) => {
              const isActive = c.key === active;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => onChange(c.key)}
                  className={[
                    "h-11 rounded-lg px-5 text-[14px]",
                    "border transition-colors font-medium",
                    "shrink-0",
                    isActive
                      ? "bg-[#1E4ED8] text-white border-[#1E4ED8]"
                      : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ DESKTOP: wrap kalsın */}
      <div className="hidden md:flex md:flex-wrap md:gap-3">
        {categories.map((c) => {
          const isActive = c.key === active;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onChange(c.key)}
              className={[
                "h-11 rounded-lg px-5 text-[15px]",
                "border transition-colors font-medium",
                isActive
                  ? "bg-[#1E4ED8] text-white border-[#1E4ED8]"
                  : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50",
              ].join(" ")}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
