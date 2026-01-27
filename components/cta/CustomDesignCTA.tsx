"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const tiles = [
  { title: "Anahtarlık", img: "/custom-products/anahtarlik.png" },
  { title: "Bardak Altlığı", img: "/custom-products/bardak-altligi.png" },
  { title: "Organizer", img: "/custom-products/organizer.png" },
  { title: "Telefon Tutacağı", img: "/custom-products/telefon-tutacagi.png" },
  { title: "Menü Standı", img: "/custom-products/menu-standi.png" },
  { title: "Ödül", img: "/custom-products/odul.png" },
];

export function CustomDesignCTA() {
  return (
    <section className="mt-12 bg-neutral-200 px-6 py-12 rounded-tl-[96px] lg:rounded-tl-[192px]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-blue-700">
            Kendi Markan İçin Ürünler Tasarlat
          </h2>
          <div className="mx-auto mt-2 max-w-xl text-sm text-neutral-700">
            Logonuza Özel Tasarımlarla Markanızı Yansıtın
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          {/* Sol görsel */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src="/custom-products/Tasarim-Onizleme.png"
              alt="Tasarım önizleme"
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
            />
          </div>

          {/* Sağ 6 tile */}
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {tiles.map((t) => (
              <div key={t.title} className="w-full">
                <div className="rounded-2xl overflow-hidden border bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <Image
                      src={t.img}
                      alt={t.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>

                  <div className="px-3 py-2 text-center text-sm font-semibold text-neutral-900 bg-white">
                    {t.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/custom-products"
            className="inline-flex h-11 min-w-48 items-center justify-center rounded-md bg-blue-700 px-6 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Daha Fazlası
          </Link>
        </div>
      </div>
    </section>
  );
}
