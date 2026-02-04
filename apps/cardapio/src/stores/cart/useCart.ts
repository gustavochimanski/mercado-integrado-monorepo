"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ---------- Types ---------- */
// LEGADO: Mantido para compatibilidade com dados antigos
export interface CartItemAdicional {
  id: number;
  nome: string;
  preco: number;
}

// NOVO: Estrutura de Complementos
export interface CartItemAdicionalComplemento {
  adicional_id: number;
  quantidade: number;
  // Dados completos para exibição (não enviado na API)
  adicional_nome?: string;
  adicional_preco?: number;
}

export interface CartItemComplemento {
  complemento_id: number;
  adicionais: CartItemAdicionalComplemento[];
  // Dados completos para exibição (não enviado na API)
  complemento_nome?: string;
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
  complementos?: CartItemComplemento[]; // NOVO: Complementos agrupados
  adicionais?: CartItemAdicional[]; // LEGADO: Mantido para compatibilidade (deprecated)
}

export interface CartCombo {
  combo_id: number;
  nome?: string; // Título/nome do combo (opcional para compatibilidade)
  quantidade: number;
  preco: number; // Preço unitário do combo
  observacao?: string;
  complementos?: CartItemComplemento[]; // NOVO: Complementos agrupados
  adicionais?: CartItemAdicional[]; // LEGADO: Mantido para compatibilidade (deprecated)
}

export interface CartReceita {
  receita_id: number;
  nome?: string; // Nome da receita (opcional para compatibilidade)
  quantidade: number;
  preco: number; // Preço unitário da receita
  observacao?: string;
  complementos?: CartItemComplemento[]; // NOVO: Complementos agrupados
  adicionais?: CartItemAdicional[]; // LEGADO: Mantido para compatibilidade (deprecated)
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
// Executar apenas uma vez quando o módulo é carregado
if (typeof window !== 'undefined') {
  try {
    const migrationKey = 'cardapio-cart-migrated';
    const alreadyMigrated = localStorage.getItem(migrationKey);
    
    if (!alreadyMigrated) {
      const stored = localStorage.getItem('cardapio-cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Se houver estrutura aninhada com 'state', limpar e reescrever
        if (parsed && typeof parsed === 'object' && 'state' in parsed && parsed.state) {
          const cleanState = parsed.state;
          localStorage.setItem('cardapio-cart', JSON.stringify(cleanState));
        }
      }
      // Marcar como migrado para não executar novamente
      localStorage.setItem(migrationKey, 'true');
    }
  } catch (e) {
    // Ignorar erros na migração
    console.warn('Erro na migração do carrinho:', e);
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
        // Função auxiliar para comparar complementos
        const getComplementosKey = (complementos?: CartItemComplemento[]) => {
          if (!complementos || complementos.length === 0) return "";
          return complementos
            .map(c => `${c.complemento_id}:${c.adicionais.map(a => `${a.adicional_id}x${a.quantidade}`).sort().join(",")}`)
            .sort()
            .join("|");
        };
        
        // Verificar se já existe um combo com o mesmo combo_id E mesmos complementos
        const complementosKeyCombo = getComplementosKey(combo.complementos);
        const index = combos.findIndex((c: CartCombo) => {
          const complementosKeyC = getComplementosKey(c.complementos);
          return c.combo_id === combo.combo_id && complementosKeyC === complementosKeyCombo;
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

          // Atualizar complementos se necessário (manter os existentes)
          if (combo.complementos && combo.complementos.length > 0) {
            updated[index].complementos = combo.complementos;
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
        // Função auxiliar para comparar complementos
        const getComplementosKey = (complementos?: CartItemComplemento[]) => {
          if (!complementos || complementos.length === 0) return "";
          return complementos
            .map(c => `${c.complemento_id}:${c.adicionais.map(a => `${a.adicional_id}x${a.quantidade}`).sort().join(",")}`)
            .sort()
            .join("|");
        };
        
        // Verificar se já existe uma receita com o mesmo receita_id E mesmos complementos
        const complementosKeyReceita = getComplementosKey(receita.complementos);
        const index = receitas.findIndex((r: CartReceita) => {
          const complementosKeyR = getComplementosKey(r.complementos);
          return r.receita_id === receita.receita_id && complementosKeyR === complementosKeyReceita;
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

          // Atualizar complementos se necessário (manter os existentes)
          if (receita.complementos && receita.complementos.length > 0) {
            updated[index].complementos = receita.complementos;
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
        // Função auxiliar para comparar complementos
        const getComplementosKey = (complementos?: CartItemComplemento[]) => {
          if (!complementos || complementos.length === 0) return "";
          return complementos
            .map(c => `${c.complemento_id}:${c.adicionais.map(a => `${a.adicional_id}x${a.quantidade}`).sort().join(",")}`)
            .sort()
            .join("|");
        };
        
        // Verificar se já existe um item com o mesmo cod_barras E mesmos complementos
        const complementosKeyItem = getComplementosKey(item.complementos);
        const index = items.findIndex((p: CartItem) => {
          const complementosKeyP = getComplementosKey(p.complementos);
          return p.cod_barras === item.cod_barras && complementosKeyP === complementosKeyItem;
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

          // Atualizar complementos se necessário (manter os existentes)
          if (item.complementos && item.complementos.length > 0) {
            updated[index].complementos = item.complementos;
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
        // Total "real" de itens: soma quantidades base + complementos (escala pela quantidade)
        const itemsTotal = get().items.reduce((total: number, item: CartItem) => {
          const qtdBase = item.quantity;
          const qtdComplementos =
            (item.complementos || []).reduce((sum, comp) => {
              const porUnidade = comp.adicionais.reduce((s, a) => s + (a.quantidade || 0), 0);
              return sum + porUnidade;
            }, 0) * item.quantity;
          const qtdAdicionaisLegado = (item.adicionais || []).length * item.quantity;
          return total + qtdBase + qtdComplementos + qtdAdicionaisLegado;
        }, 0);

        const combosTotal = get().combos.reduce((total: number, combo: CartCombo) => {
          const qtdBase = combo.quantidade;
          const qtdComplementos =
            (combo.complementos || []).reduce((sum, comp) => {
              const porUnidade = comp.adicionais.reduce((s, a) => s + (a.quantidade || 0), 0);
              return sum + porUnidade;
            }, 0) * combo.quantidade;
          const qtdAdicionaisLegado = (combo.adicionais || []).length * combo.quantidade;
          return total + qtdBase + qtdComplementos + qtdAdicionaisLegado;
        }, 0);

        const receitasTotal = get().receitas.reduce((total: number, receita: CartReceita) => {
          const qtdBase = receita.quantidade;
          const qtdComplementos =
            (receita.complementos || []).reduce((sum, comp) => {
              const porUnidade = comp.adicionais.reduce((s, a) => s + (a.quantidade || 0), 0);
              return sum + porUnidade;
            }, 0) * receita.quantidade;
          const qtdAdicionaisLegado = (receita.adicionais || []).length * receita.quantidade;
          return total + qtdBase + qtdComplementos + qtdAdicionaisLegado;
        }, 0);

        return itemsTotal + combosTotal + receitasTotal;
      },

      totalPrice: () => {
        // Soma dos produtos
        const itemsTotal = get().items.reduce((total: number, item: CartItem) => {
          const precoItem = item.preco * item.quantity;
          // NOVO: Calcular preço dos complementos
          const precoComplementos = (item.complementos || []).reduce((sum, comp) => {
            const precoComp = comp.adicionais.reduce((s, a) => {
              const precoAdicional = a.adicional_preco || 0;
              return s + (precoAdicional * a.quantidade);
            }, 0);
            return sum + precoComp;
          }, 0) * item.quantity;
          // LEGADO: Suporte para adicionais antigos
          const precoAdicionaisLegado = (item.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * item.quantity;
          return total + precoItem + precoComplementos + precoAdicionaisLegado;
        }, 0);
        
        // Soma dos combos
        const combosTotal = get().combos.reduce((total: number, combo: CartCombo) => {
          const precoCombo = combo.preco * combo.quantidade;
          // NOVO: Calcular preço dos complementos
          const precoComplementos = (combo.complementos || []).reduce((sum, comp) => {
            const precoComp = comp.adicionais.reduce((s, a) => {
              const precoAdicional = a.adicional_preco || 0;
              return s + (precoAdicional * a.quantidade);
            }, 0);
            return sum + precoComp;
          }, 0) * combo.quantidade;
          // LEGADO: Suporte para adicionais antigos
          const precoAdicionaisLegado = (combo.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * combo.quantidade;
          return total + precoCombo + precoComplementos + precoAdicionaisLegado;
        }, 0);
        
        // Soma das receitas
        const receitasTotal = get().receitas.reduce((total: number, receita: CartReceita) => {
          const precoReceita = receita.preco * receita.quantidade;
          // NOVO: Calcular preço dos complementos
          const precoComplementos = (receita.complementos || []).reduce((sum, comp) => {
            const precoComp = comp.adicionais.reduce((s, a) => {
              const precoAdicional = a.adicional_preco || 0;
              return s + (precoAdicional * a.quantidade);
            }, 0);
            return sum + precoComp;
          }, 0) * receita.quantidade;
          // LEGADO: Suporte para adicionais antigos
          const precoAdicionaisLegado = (receita.adicionais || []).reduce((sum, adic) => sum + adic.preco, 0) * receita.quantidade;
          return total + precoReceita + precoComplementos + precoAdicionaisLegado;
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
      storage: createJSONStorage(() => {
        // No servidor (SSR), localStorage não existe, então retornamos um objeto vazio
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          } as any;
        }
        return localStorage;
      }),
      partialize: (state) => ({
        items: state.items,
        combos: state.combos,
        receitas: state.receitas,
        observacao: state.observacao,
        editingPedidoId: state.editingPedidoId,
      }),
      // Garantir que não há duplicação no estado e limpar estrutura antiga
      merge: (persistedState, currentState) => {
        // Se não há estado persistido, retornar o estado atual (vazio inicial)
        if (!persistedState || typeof persistedState !== 'object') {
          return currentState;
        }

        // Se houver um objeto 'state' aninhado (estrutura antiga), usar apenas o conteúdo
        if ('state' in persistedState) {
          const nestedState = (persistedState as any).state;
          if (nestedState && typeof nestedState === 'object') {
            // Limpar o localStorage antigo e retornar apenas o estado interno
            try {
              if (typeof window !== 'undefined') {
                // Não remover o item, apenas reescrever com a estrutura correta
                localStorage.setItem('cardapio-cart', JSON.stringify(nestedState));
              }
            } catch (e) {
              // Ignorar erros ao limpar
            }
            // Retornar o estado aninhado mesclado com o estado atual (para garantir que todas as funções estejam presentes)
            return { ...currentState, ...nestedState };
          }
        }

        // Se o persistedState já tem a estrutura correta, mesclar com o estado atual
        // Isso garante que todas as funções do estado estejam presentes
        return { ...currentState, ...persistedState };
      },
      // Callback após reidratação do storage
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Erro ao reidratar carrinho do localStorage:', error);
          return;
        }
        
        // Log para debug (pode ser removido em produção)
        if (process.env.NODE_ENV === 'development' && state) {
          const totalItems = (state.items?.length || 0) + (state.combos?.length || 0) + (state.receitas?.length || 0);
          if (totalItems > 0) {
            console.log(`✅ Carrinho reidratado com ${totalItems} item(ns)`);
          }
        }
      },
    }
  )
);
