"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ---------- Types ---------- */
export interface CartItemAdicional {
  id: number;
  nome: string;
  preco: number;
}

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
  adicionais?: CartItemAdicional[]; // Dados completos dos adicionais
}

export interface CartCombo {
  combo_id: number;
  nome?: string; // Título/nome do combo (opcional para compatibilidade)
  quantidade: number;
  preco: number; // Preço unitário do combo
  observacao?: string;
  adicionais?: CartItemAdicional[]; // Dados completos dos adicionais
}

export interface CartReceita {
  receita_id: number;
  nome?: string; // Nome da receita (opcional para compatibilidade)
  quantidade: number;
  preco: number; // Preço unitário da receita
  observacao?: string;
  adicionais?: CartItemAdicional[]; // Dados completos dos adicionais
}

interface CartState {
  items: CartItem[];
  combos: CartCombo[]; // Lista de combos no carrinho
  receitas: CartReceita[]; // Lista de receitas no carrinho
  observacao: string;
  editingPedidoId: number | null;
  setObservacao: (texto: string) => void;
  add: (item: CartItem) => void;
  addCombo: (combo: CartCombo) => void;
  removeCombo: (combo_id: number) => void;
  incCombo: (combo_id: number, step?: number) => void;
  decCombo: (combo_id: number, step?: number) => void;
  addReceita: (receita: CartReceita) => void;
  removeReceita: (receita_id: number) => void;
  incReceita: (receita_id: number, step?: number) => void;
  decReceita: (receita_id: number, step?: number) => void;
  updateAdicionaisItem: (cod_barras: string, adicionais: CartItemAdicional[]) => void;
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

/* ---------- Migração: Limpar estrutura antiga do localStorage ---------- */
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('cardapio-cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Se houver estrutura aninhada com 'state', limpar e reescrever
      if (parsed && typeof parsed === 'object' && 'state' in parsed && parsed.state) {
        const cleanState = parsed.state;
        localStorage.setItem('cardapio-cart', JSON.stringify(cleanState));
      }
    }
  } catch (e) {
    // Ignorar erros na migração
  }
}

/* ---------- Store ---------- */
export const useCart = create<CartState>()(
  persist(
    withLogger<CartState>((set, get) => ({
      items: [],
      combos: [],
      receitas: [],
      observacao: "",
      editingPedidoId: null,

      setObservacao: (texto) => {
        set({ observacao: texto });
      },

      addCombo: (combo) => {
        const combos = get().combos;
        // Função auxiliar para extrair IDs dos adicionais
        const getAdicionaisIds = (adicionais?: CartItemAdicional[]) => 
          (adicionais || []).map(a => a.id).sort();
        
        // Verificar se já existe um combo com o mesmo combo_id E mesmos adicionais
        const adicionaisIdsCombo = getAdicionaisIds(combo.adicionais).join(',');
        const index = combos.findIndex((c: CartCombo) => {
          const adicionaisIdsC = getAdicionaisIds(c.adicionais).join(',');
          return c.combo_id === combo.combo_id && adicionaisIdsC === adicionaisIdsCombo;
        });

        if (index === -1) {
          // Combo não existe, adicionar novo
          set({ combos: [...combos, combo] });
        } else {
          // Combo existe, incrementar quantidade
          const updated = [...combos];
          updated[index].quantidade += combo.quantidade;

          if (combo.observacao) {
            updated[index].observacao = combo.observacao;
          }

          // Atualizar adicionais se necessário (manter os existentes)
          if (combo.adicionais && combo.adicionais.length > 0) {
            updated[index].adicionais = combo.adicionais;
          }

          set({ combos: updated });
        }
      },

      removeCombo: (combo_id) => {
        set({
          combos: get().combos.filter((c: CartCombo) => c.combo_id !== combo_id),
        });
      },

      incCombo: (combo_id, step = 1) => {
        set({
          combos: get().combos.map((c: CartCombo) =>
            c.combo_id === combo_id
              ? { ...c, quantidade: c.quantidade + step }
              : c
          ),
        });
      },

      decCombo: (combo_id, step = 1) => {
        set({
          combos: get().combos
            .map((c: CartCombo) =>
              c.combo_id === combo_id
                ? { ...c, quantidade: c.quantidade - step }
                : c
            )
            .filter((c: CartCombo) => c.quantidade > 0),
        });
      },

      addReceita: (receita) => {
        const receitas = get().receitas;
        // Função auxiliar para extrair IDs dos adicionais
        const getAdicionaisIds = (adicionais?: CartItemAdicional[]) => 
          (adicionais || []).map(a => a.id).sort();
        
        // Verificar se já existe uma receita com o mesmo receita_id E mesmos adicionais
        const adicionaisIdsReceita = getAdicionaisIds(receita.adicionais).join(',');
        const index = receitas.findIndex((r: CartReceita) => {
          const adicionaisIdsR = getAdicionaisIds(r.adicionais).join(',');
          return r.receita_id === receita.receita_id && adicionaisIdsR === adicionaisIdsReceita;
        });

        if (index === -1) {
          // Receita não existe, adicionar nova
          set({ receitas: [...receitas, receita] });
        } else {
          // Receita existe, incrementar quantidade
          const updated = [...receitas];
          updated[index].quantidade += receita.quantidade;

          if (receita.observacao) {
            updated[index].observacao = receita.observacao;
          }

          // Atualizar adicionais se necessário (manter os existentes)
          if (receita.adicionais && receita.adicionais.length > 0) {
            updated[index].adicionais = receita.adicionais;
          }

          set({ receitas: updated });
        }
      },

      removeReceita: (receita_id) => {
        set({
          receitas: get().receitas.filter((r: CartReceita) => r.receita_id !== receita_id),
        });
      },

      incReceita: (receita_id, step = 1) => {
        set({
          receitas: get().receitas.map((r: CartReceita) =>
            r.receita_id === receita_id
              ? { ...r, quantidade: r.quantidade + step }
              : r
          ),
        });
      },

      decReceita: (receita_id, step = 1) => {
        set({
          receitas: get().receitas
            .map((r: CartReceita) =>
              r.receita_id === receita_id
                ? { ...r, quantidade: r.quantidade - step }
                : r
            )
            .filter((r: CartReceita) => r.quantidade > 0),
        });
      },

      updateAdicionaisItem: (cod_barras, adicionais) => {
        set({
          items: get().items.map((item: { cod_barras: string; }) =>
            item.cod_barras === cod_barras
              ? { ...item, adicionais }
              : item
          ),
        });
      },

      add: (item) => {
        const items = get().items;
        // Função auxiliar para extrair IDs dos adicionais
        const getAdicionaisIds = (adicionais?: CartItemAdicional[]) => 
          (adicionais || []).map(a => a.id).sort();
        
        // Verificar se já existe um item com o mesmo cod_barras E mesmos adicionais
        const adicionaisIdsItem = getAdicionaisIds(item.adicionais).join(',');
        const index = items.findIndex((p: CartItem) => {
          const adicionaisIdsP = getAdicionaisIds(p.adicionais).join(',');
          return p.cod_barras === item.cod_barras && adicionaisIdsP === adicionaisIdsItem;
        });

        if (index === -1) {
          // Item não existe, adicionar novo
          set({ items: [...items, item] });
        } else {
          // Item existe, incrementar quantidade
          const updated = [...items];
          updated[index].quantity += item.quantity;

          if (item.observacao) {
            updated[index].observacao = item.observacao;
          }

          // Atualizar adicionais se necessário (manter os existentes)
          if (item.adicionais && item.adicionais.length > 0) {
            updated[index].adicionais = item.adicionais;
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

      clear: () => set({ items: [], combos: [], receitas: [], observacao: "", editingPedidoId: null }),

      totalItems: () => {
        const itemsTotal = get().items.reduce((total: any, item: { quantity: any; }) => total + item.quantity, 0);
        const combosTotal = get().combos.reduce((total: any, combo: { quantidade: any; }) => total + combo.quantidade, 0);
        const receitasTotal = get().receitas.reduce((total: any, receita: { quantidade: any; }) => total + receita.quantidade, 0);
        return itemsTotal + combosTotal + receitasTotal;
      },

      totalPrice: () => {
        // Soma dos produtos
        const itemsTotal = get().items.reduce((total: number, item: CartItem) => {
          const precoItem = item.preco * item.quantity;
          const precoAdicionais = (item.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * item.quantity;
          return total + precoItem + precoAdicionais;
        }, 0);
        
        // Soma dos combos
        const combosTotal = get().combos.reduce((total: number, combo: CartCombo) => {
          const precoCombo = combo.preco * combo.quantidade;
          const precoAdicionais = (combo.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * combo.quantidade;
          return total + precoCombo + precoAdicionais;
        }, 0);
        
        // Soma das receitas
        const receitasTotal = get().receitas.reduce((total: number, receita: CartReceita) => {
          const precoReceita = receita.preco * receita.quantidade;
          const precoAdicionais = (receita.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * receita.quantidade;
          return total + precoReceita + precoAdicionais;
        }, 0);
        
        return itemsTotal + combosTotal + receitasTotal;
      },

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
          receitas: [],
          observacao: ""
        });
      },
    })),
    {
      name: "cardapio-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        combos: state.combos,
        receitas: state.receitas,
        observacao: state.observacao,
        editingPedidoId: state.editingPedidoId,
      }),
      // Garantir que não há duplicação no estado e limpar estrutura antiga
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        // Se houver um objeto 'state' aninhado (estrutura antiga), usar apenas o conteúdo
        if ('state' in persistedState) {
          const nestedState = (persistedState as any).state;
          if (nestedState && typeof nestedState === 'object') {
            // Limpar o localStorage antigo e retornar apenas o estado interno
            try {
              localStorage.removeItem('cardapio-cart');
            } catch (e) {
              // Ignorar erros ao limpar
            }
            return { ...currentState, ...nestedState };
          }
        }

        // Se o persistedState já tem a estrutura correta, usar diretamente
        return { ...currentState, ...persistedState };
      },
      // Migração: limpar dados antigos na primeira carga
      onRehydrateStorage: () => (state) => {
        if (state && typeof state === 'object' && 'state' in state) {
          // Se ainda houver estrutura aninhada após merge, limpar
          try {
            const stored = localStorage.getItem('cardapio-cart');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed && typeof parsed === 'object' && 'state' in parsed) {
                // Reescrever sem o objeto state aninhado
                const cleanState = parsed.state || parsed;
                localStorage.setItem('cardapio-cart', JSON.stringify(cleanState));
              }
            }
          } catch (e) {
            // Ignorar erros
          }
        }
      },
    }
  )
);
