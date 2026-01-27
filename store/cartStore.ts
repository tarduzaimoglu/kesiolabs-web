import { create } from "zustand";

export type CartItem = {
  key: string; // productId:variantId gibi benzersiz
  productId: string;
  variantId?: string;
  name: string;
  imageUrl?: string;
  unitPrice?: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  increase: (key: string) => void;
  decrease: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;

  totalQuantity: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, qty = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.key === item.key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === item.key ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: qty }] };
    });
  },

  increase: (key) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.key === key ? { ...i, quantity: i.quantity + 1 } : i
      ),
    }));
  },

  decrease: (key) => {
    set((state) => {
      const found = state.items.find((i) => i.key === key);
      if (!found) return state;

      // 1'den düşerse otomatik sil
      if (found.quantity <= 1) {
        return { items: state.items.filter((i) => i.key !== key) };
      }

      return {
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  remove: (key) => {
    set((state) => ({ items: state.items.filter((i) => i.key !== key) }));
  },

  clear: () => set({ items: [] }),

  totalQuantity: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
