"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ---------- Types ---------- */
export interface CartItem {
  cod_barras: string;
  nome: string;
  preco: number;
  quantity: number;
  empresaId: number;
  imagem?: string | null;
  categoriaId?: number;
  subcategoriaId?: number;
  observacao?: string;
  adicionais_ids?: number[]; // IDs dos adicionais selecionados para este item
}

export interface CartCombo {
  combo_id: number;
  quantidade: number;
}

interface CartState {
  items: CartItem[];
  combos: CartCombo[]; // Lista de combos no carrinho
  observacao: string;
  editingPedidoId: number | null;
  setObservacao: (texto: string) => void;
  add: (item: CartItem) => void;
  addCombo: (combo: CartCombo) => void;
  removeCombo: (combo_id: number) => void;
  updateAdicionaisItem: (cod_barras: string, adicionais_ids: number[]) => void;
  inc: (cod_barras: string, step?: number) => void;
  dec: (cod_barras: string, step?: number) => void;
  updateObservacaoItem: (cod_barras: string, observacao: string) => void;
  remove: (cod_barras: string) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  startEditingPedido: (pedidoId: number, items: CartItem[], observacao?: string) => void;
  stopEditingPedido: () => void;
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
      combos: [],
      observacao: "",
      editingPedidoId: null,

      setObservacao: (texto) => {
        set({ observacao: texto });
      },

      addCombo: (combo) => {
        const combos = get().combos;
        const index = combos.findIndex((c: CartCombo) => c.combo_id === combo.combo_id);

        if (index === -1) {
          set({ combos: [...combos, combo] });
        } else {
          const updated = [...combos];
          updated[index].quantidade += combo.quantidade;
          set({ combos: updated });
        }
      },

      removeCombo: (combo_id) => {
        set({
          combos: get().combos.filter((c: CartCombo) => c.combo_id !== combo_id),
        });
      },

      updateAdicionaisItem: (cod_barras, adicionais_ids) => {
        set({
          items: get().items.map((item: { cod_barras: string; }) =>
            item.cod_barras === cod_barras
              ? { ...item, adicionais_ids }
              : item
          ),
        });
      },

      add: (item) => {
        const items = get().items;
        const index = items.findIndex((p: { cod_barras: string; }) => p.cod_barras === item.cod_barras);

        if (index === -1) {
          set({ items: [...items, item] });
        } else {
          const updated = [...items];
          updated[index].quantity += item.quantity;

          if (item.observacao) {
            updated[index].observacao = item.observacao;
          }

          set({ items: updated });
        }
      },

      inc: (cod_barras, step = 1) =>
        set({
          items: get().items.map((p: { cod_barras: string; quantity: number; }) =>
            p.cod_barras === cod_barras
              ? { ...p, quantity: p.quantity + step }
              : p
          ),
        }),

      dec: (cod_barras, step = 1) =>
        set({
          items: get().items
            .map((p: { cod_barras: string; quantity: number; }) =>
              p.cod_barras === cod_barras
                ? { ...p, quantity: p.quantity - step }
                : p
            )
            .filter((p: { quantity: number; }) => p.quantity > 0),
        }),

      updateObservacaoItem: (cod_barras, texto) =>
        set({
          items: get().items.map((item: { cod_barras: string; }) =>
            item.cod_barras === cod_barras
              ? { ...item, observacao: texto }
              : item
          ),
        }),

      remove: (cod_barras) =>
        set({
          items: get().items.filter((p: { cod_barras: string; }) => p.cod_barras !== cod_barras),
        }),

      clear: () => set({ items: [], combos: [], observacao: "", editingPedidoId: null }),

      totalItems: () =>
        get().items.reduce((total: any, item: { quantity: any; }) => total + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((total: number, item: { quantity: number; preco: number; }) => total + item.quantity * item.preco, 0),

      startEditingPedido: (pedidoId, items, observacao = "") => {
        set({
          editingPedidoId: pedidoId,
          items,
          observacao
        });
      },

      stopEditingPedido: () => {
        set({
          editingPedidoId: null,
          items: [],
          combos: [],
          observacao: ""
        });
      },
    })),
    {
      name: "cardapio-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        combos: s.combos,
        observacao: s.observacao,
        editingPedidoId: s.editingPedidoId,
      }),
    }
  )
);
