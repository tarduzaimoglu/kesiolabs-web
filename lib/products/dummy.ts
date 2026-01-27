import { Product, ProductCategoryKey } from "./types";

export const productCategories: { key: ProductCategoryKey; label: string }[] = [
  { key: "featured", label: "Öne Çıkanlar" },
  { key: "flexi", label: "Flexi Anahtarlıklar" },
  { key: "sport", label: "Spor Anahtarlıklar" },
  { key: "car", label: "Araç Anahtarlıkları" },
  { key: "gift", label: "Hediyelik Eşyalar" },
  { key: "figure", label: "Figürler" },
];

const duckImg = "/products/yavru-ordek-anahtarlik.png";

export const products: Product[] = [
  {
    id: "p_duck_keychain",
    title: "Yavru Ördek Anahtarlık",
    category: "flexi",
    imageUrl: duckImg,
    shortDescription: "Hareketli Yavru Ördek Anahtarlığı",
    bullets: [
      "Toptan siparişe uygundur",
      "Minimum sipariş adedi uygulanır",
      "Renk ve üretim detayları siparişe göre belirlenir",
    ],
    specs: [
      "Malzeme: PLA (Polylactic Acid)",
      "Üretim Yöntemi: 3D baskı",
      "Yapı: Esnek / hareketli gövde",
    ],
    wholesalePriceText: "… TL/adet",
    minQtyText: "…",
    featured: true,
    createdAtISO: "2026-01-10T10:00:00.000Z",
  },

  ...Array.from({ length: 17 }).map((_, i): Product => {
    const cats: ProductCategoryKey[] = ["flexi", "sport", "car", "gift", "figure"];
    const category = cats[i % cats.length];

    return {
      id: `p_dummy_${i + 1}`,
      title: "Yavru Ördek Anahtarlık",
      category,
      imageUrl: duckImg,
      shortDescription: "Kişiselleştirilebilir ürün",
      bullets: [
        "Toptan siparişe uygundur",
        "Minimum sipariş adedi uygulanır",
        "Renk ve üretim detayları siparişe göre belirlenir",
      ],
      specs: ["Malzeme: PLA", "Üretim Yöntemi: 3D baskı", "Yapı: Özel üretim"],
      wholesalePriceText: "… TL/adet",
      minQtyText: "…",
      featured: i % 4 === 0,
      createdAtISO: `2026-01-${String(18 - i).padStart(2, "0")}T10:00:00.000Z`,
    };
  }),
];
