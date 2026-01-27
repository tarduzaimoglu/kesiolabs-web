export type BlogCategory = {
  slug: "uretim" | "tasarim" | "malzeme" | "ipuclari";
  title: string;
  description: string;
  images: [string, string, string, string];
};

export const blogCategories: BlogCategory[] = [
  {
    slug: "uretim",
    title: "Üretim",
    description: "Seri üretim, prototipleme ve atölye süreçlerimize dair yazılar.",
    images: ["/cat/a.png", "/cat/b.png", "/cat/c.png", "/cat/d.png"],
  },
  {
    slug: "tasarim",
    title: "Tasarım",
    description: "Endüstriyel tasarım süreçleri, modelleme ve karar noktaları.",
    images: ["/cat/e.png", "/cat/f.png", "/cat/g.png", "/cat/h.png"],
  },
  {
    slug: "malzeme",
    title: "Malzeme",
    description: "PLA, ABS ve mühendislik plastikleri hakkında pratik bilgiler.",
    images: ["/cat/i.png", "/cat/j.png", "/cat/k.png", "/cat/l.png"],
  },
  {
    slug: "ipuclari",
    title: "İpuçları",
    description: "Baskı kalitesi, toleranslar, model hazırlığı ve püf noktaları.",
    images: ["/cat/m.png", "/cat/n.png", "/cat/o.png", "/cat/p.png"],
  },
];

export function getCategoryBySlug(slug: string) {
  return blogCategories.find((c) => c.slug === slug) ?? null;
}
