"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ---------- Types ---------- */
export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  quantity: number;
  empresaId: number;
  imagem?: string | null;
  categoriaId?: number;
  subcategoriaId?: number;
}
interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  inc: (id: string, step?: number) => void;
  dec: (id: string, step?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

/* ---------- Logger middleware ---------- */
const withLogger =
  <T extends object>(fn: (set: any, get: any, api: any) => T) =>
  (set: any, get: any, api: any): T => {
    const wrap =
      (name: keyof T, action: any) =>
      (...args: any[]) => {
        const result = action(...args);
        return result;
      };

    const obj = fn(set, get, api);
    const wrapped: any = {};

    for (const k of Object.keys(obj) as (keyof T)[]) {
      wrapped[k] =
        typeof obj[k] === "function" ? wrap(k, obj[k]) : obj[k];
    }
    return wrapped;
  };

/* ---------- Store ---------- */
export const useCart = create<CartState>()(
  persist(
    withLogger<CartState>((set, get) => ({
      items: [],

      add: (item) => {
        const items = get().items;
        const i = items.findIndex((p:any) => p.id === item.id);
        if (i === -1) set({ items: [...items, item] });
        else {
          const clone = [...items];
          clone[i].quantity += item.quantity;
          set({ items: clone });
        }
      },

      inc: (id, step = 1) =>
        set({
          items: get().items.map((p:any) =>
            p.id === id ? { ...p, quantity: p.quantity + step } : p
          ),
        }),

      dec: (id, step = 1) =>
        set({
          items: get().items
            .map((p:any) =>
              p.id === id ? { ...p, quantity: p.quantity - step } : p
            )
            .filter((p:any) => p.quantity > 0),
        }),

      remove: (id) => set({ items: get().items.filter((p:any) => p.id !== id) }),

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((s:any, p:any) => s + p.quantity, 0),

      totalPrice: () =>
        get().items.reduce((s:any, p:any) => s + p.quantity * p.preco, 0),
    })),
    {
      name: "cardapio-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);

/* ---------- Extra: log após hidratar ---------- */
if (typeof window !== "undefined") {
  useCart.persist.onFinishHydration(() => {
  });
}
