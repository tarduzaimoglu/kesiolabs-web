"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products/types";
import { discountPerUnitTRY, effectiveUnitPriceTRY } from "@/lib/pricing";

export const CART_MIN_QTY = 20;
export const CART_MAX_QTY = 2000;
export const CART_STEP = 20;

// ✅ fiyat yoksa geçici deneme fiyatı
export const FALLBACK_UNIT_PRICE = 25;

/**
 * ✅ LocalStorage key + versiyon
 * Yapıda büyük değişiklik olursa v2 yapıp eskiyi otomatik temizleyebilirsin.
 */
const STORAGE_KEY = "kesiolabs_cart_v1";

/**
 * ✅ LocalStorage’a yazacağımız minimal şekil:
 * UI için gerekli olanlar (id, title, imageUrl, wholesalePrice, qty).
 * Product’ın tamamını saklamak zorunda değilsin (Strapi datası şişebilir).
 */
type StoredCartItem = {
  id: string;
  qty: number;
  product: {
    id: string;
    title: string;
    imageUrl?: string;
    wholesalePrice?: number;
  };
};

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return CART_MIN_QTY;
  const rounded = Math.round(qty / CART_STEP) * CART_STEP; // 20'nin katı
  return Math.min(CART_MAX_QTY, Math.max(CART_MIN_QTY, rounded));
}

export type CartItem = {
  id: string;
  product: Product & {
    // ✅ Base (indirimsiz) birim fiyatı burada sakla
    wholesalePrice?: number;
    imageUrl?: string;
  };
  qty: number;
};

type AddPayload = {
  id: string;
  title: string;
  price?: number; // TL/adet (BASE)
  image?: string;
  qty?: number; // seçilen adet
};

type CartContextValue = {
  items: CartItem[];

  // ✅ ikon/badge için: ürün çeşidi (line item sayısı)
  itemCount: number;

  // ✅ sepet sayfası için: toplam adet (sum qty)
  qtyCount: number;

  // ✅ Hydration tamam mı? (ilk yüklemede 0 görünüp sonra dolma durumlarını yönetmek için)
  hydrated: boolean;

  // ✅ fiyat motoru (site geneli)
  unitPriceOf: (productId: string) => number; // BASE
  discountPerUnitOf: (productId: string) => number; // qty'ye göre
  effectiveUnitPriceOf: (productId: string) => number; // indirimli
  lineTotalOf: (productId: string) => number; // indirimli birim * qty
  cartTotal: number; // tüm satırların toplamı (indirimli)

  addItem: (payload: AddPayload) => void;

  setQty: (productId: string, qty: number) => void;
  inc: (productId: string, step?: number) => void;
  dec: (productId: string, step?: number) => void;

  remove: (productId: string) => void;
  clear: () => void;
};

const CartCtx = createContext<CartContextValue | null>(null);

/** ✅ güvenli JSON parse */
function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** ✅ storage verisini bizim CartItem tipine normalize et */
function normalizeStoredItems(input: any): CartItem[] {
  if (!Array.isArray(input)) return [];

  const normalized: CartItem[] = [];

  for (const it of input) {
    if (!it || typeof it !== "object") continue;

    const id = typeof it.id === "string" ? it.id : null;
    const qty = clampQty(Number(it.qty));

    const p = it.product && typeof it.product === "object" ? it.product : {};
    const title = typeof p.title === "string" ? p.title : "";

    if (!id || !title) continue;

    const wholesalePrice =
      typeof p.wholesalePrice === "number" ? p.wholesalePrice : undefined;
    const imageUrl = typeof p.imageUrl === "string" ? p.imageUrl : undefined;

    const product = {
      id,
      title,
      imageUrl,
      wholesalePrice,
    } as any as Product;

    normalized.push({
      id,
      qty,
      product,
    });
  }

  return normalized;
}

/** ✅ CartItem[] -> localStorage’a yazılacak minimal format */
function toStored(items: CartItem[]): StoredCartItem[] {
  return items.map((it) => ({
    id: it.id,
    qty: clampQty(it.qty ?? CART_MIN_QTY),
    product: {
      id: it.product?.id ?? it.id,
      title: (it.product as any)?.title ?? "",
      imageUrl: (it.product as any)?.imageUrl,
      wholesalePrice: (it.product as any)?.wholesalePrice,
    },
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  /**
   * ✅ 1) İlk açılışta localStorage’dan yükle
   * (refresh sonrası sepet geri gelir)
   */
  useEffect(() => {
    const saved = safeJsonParse<any>(localStorage.getItem(STORAGE_KEY));

    // Beklenen format: { items: [...] } veya direkt [...]
    const maybeItems = Array.isArray(saved?.items) ? saved.items : Array.isArray(saved) ? saved : null;

    if (maybeItems) {
      const normalized = normalizeStoredItems(maybeItems);
      setItems(normalized);
    }

    setHydrated(true);
  }, []);

  /**
   * ✅ 2) items değiştikçe localStorage’a yaz
   * - hydrated false iken yazma (ilk load sırasında gereksiz overwrite olmasın)
   */
  useEffect(() => {
    if (!hydrated) return;
    const payload = { items: toStored(items) };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [items, hydrated]);

  /**
   * ✅ 3) Tab’ler arası senkron
   * - başka tab localStorage’ı değiştirince bu tab da güncellenir
   */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;

      const saved = safeJsonParse<any>(e.newValue);

      const maybeItems = Array.isArray(saved?.items)
        ? saved.items
        : Array.isArray(saved)
          ? saved
          : null;

      if (!maybeItems) {
        // Diğer tab clear yaptıysa
        setItems([]);
        return;
      }

      const normalized = normalizeStoredItems(maybeItems);

      // Gereksiz render/loop engeli: aynıysa set etme
      setItems((prev) => {
        const a = JSON.stringify(toStored(prev));
        const b = JSON.stringify(toStored(normalized));
        return a === b ? prev : normalized;
      });
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.length;
    const qtyCount = items.reduce((sum, it) => sum + (it.qty || 0), 0);

    const findItem = (productId: string) => items.find((x) => x.id === productId);

    const unitPriceOf = (productId: string) => {
      const it = findItem(productId);
      const base = it?.product?.wholesalePrice;
      return typeof base === "number" ? base : FALLBACK_UNIT_PRICE;
    };

    const discountPerUnitOf = (productId: string) => {
      const it = findItem(productId);
      const q = it?.qty ?? CART_MIN_QTY;
      return discountPerUnitTRY(q);
    };

    const effectiveUnitPriceOf = (productId: string) => {
      const base = unitPriceOf(productId);
      const it = findItem(productId);
      const q = it?.qty ?? CART_MIN_QTY;
      return effectiveUnitPriceTRY(base, q);
    };

    const lineTotalOf = (productId: string) => {
      const it = findItem(productId);
      if (!it) return 0;
      const base = unitPriceOf(productId);
      const q = it.qty ?? CART_MIN_QTY;
      const eff = effectiveUnitPriceTRY(base, q);
      return eff * q;
    };

    const cartTotal = items.reduce((sum, it) => {
      const base =
        typeof it.product?.wholesalePrice === "number"
          ? it.product.wholesalePrice
          : FALLBACK_UNIT_PRICE;
      const q = it.qty ?? CART_MIN_QTY;
      return sum + effectiveUnitPriceTRY(base, q) * q;
    }, 0);

    const setQty = (productId: string, qty: number) => {
      const next = clampQty(qty);
      setItems((prev) => prev.map((x) => (x.id === productId ? { ...x, qty: next } : x)));
    };

    const inc = (productId: string, step = CART_STEP) => {
      setItems((prev) =>
        prev.map((x) => {
          if (x.id !== productId) return x;
          return { ...x, qty: clampQty((x.qty || CART_MIN_QTY) + step) };
        })
      );
    };

    const dec = (productId: string, step = CART_STEP) => {
      setItems((prev) =>
        prev.map((x) => {
          if (x.id !== productId) return x;
          // min altına düşme (silme ayrı)
          return { ...x, qty: Math.max(CART_MIN_QTY, (x.qty || CART_MIN_QTY) - step) };
        })
      );
    };

    const addItem = (payload: AddPayload) => {
      const incomingQty = clampQty(payload.qty ?? CART_MIN_QTY);

      // ✅ payload.price = BASE birim fiyat (indirimsiz)
      const incomingBasePrice =
        typeof payload.price === "number" ? payload.price : FALLBACK_UNIT_PRICE;

      setItems((prev) => {
        const idx = prev.findIndex((x) => x.id === payload.id);

        if (idx >= 0) {
          // ✅ aynı ürünse ikinci satır ekleme, qty artır
          const copy = [...prev];
          const existing = copy[idx];

          const nextQty = clampQty((existing.qty || CART_MIN_QTY) + incomingQty);

          const p = { ...existing.product } as any;

          // ✅ base fiyatı güncel tut (varsa yeni gelenle overwrite edebilir)
          p.wholesalePrice = incomingBasePrice;

          if (payload.image) p.imageUrl = payload.image;

          copy[idx] = { ...existing, product: p, qty: nextQty };
          return copy;
        }

        // yeni ürün
        const product = {
          id: payload.id,
          title: payload.title,
          imageUrl: payload.image,
          wholesalePrice: incomingBasePrice, // ✅ BASE
        } as any as Product;

        return [...prev, { id: payload.id, product, qty: incomingQty }];
      });
    };

    const remove = (productId: string) => setItems((prev) => prev.filter((x) => x.id !== productId));

    const clear = () => setItems([]);

    return {
      items,
      itemCount,
      qtyCount,
      hydrated,

      unitPriceOf,
      discountPerUnitOf,
      effectiveUnitPriceOf,
      lineTotalOf,
      cartTotal,

      addItem,
      setQty,
      inc,
      dec,
      remove,
      clear,
    };
  }, [items, hydrated]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
