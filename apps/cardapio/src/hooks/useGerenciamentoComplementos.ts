"use client";

import { useState, useCallback, useMemo } from "react";
import type { ComplementoResponse } from "@cardapio/types/complementos";
import type { CartItemComplemento, CartItemAdicionalComplemento } from "@cardapio/stores/cart/useCart";
import { validarComplementosObrigatorios } from "@cardapio/utils/complementos/validacoes";

/**
 * Hook para gerenciar a seleção de complementos
 * 
 * Este hook centraliza a lógica de seleção, incremento, decremento e validação
 * de complementos, facilitando a reutilização em diferentes componentes.
 * 
 * @param complementos - Array de complementos disponíveis
 * @returns Objeto com estado e funções para gerenciar complementos
 * 
 * @example
 * ```tsx
 * const { complementosSelecionados, selecionarAdicional, limparSelecao, validar } = useGerenciamentoComplementos(complementos);
 * ```
 */
export function useGerenciamentoComplementos(
  complementos: ComplementoResponse[]
) {
  // Estado: Map<complemento_id, Map<adicional_id, quantidade>>
  const [selecoes, setSelecoes] = useState<Map<number, Map<number, number>>>(
    new Map()
  );

  /**
   * Seleciona ou atualiza a quantidade de um adicional em um complemento
   */
  const selecionarAdicional = useCallback(
    (
      complementoId: number,
      adicionalId: number,
      quantidade: number
    ) => {
      setSelecoes((prev) => {
        const novo = new Map(prev);

        const complemento = complementos.find((c) => c.id === complementoId);
        if (!complemento) return prev;

        // Se quantidade <= 0, remover
        if (quantidade <= 0) {
          const compSelecoes = novo.get(complementoId);
          if (compSelecoes) {
            compSelecoes.delete(adicionalId);
            if (compSelecoes.size === 0) {
              novo.delete(complementoId);
            }
          }
          return novo;
        }

        // Verificar se permite múltipla escolha
        if (!complemento.permite_multipla_escolha) {
          // Remover outros adicionais do mesmo complemento
          const novosAdicionais = new Map<number, number>();
          novosAdicionais.set(
            adicionalId,
            complemento.quantitativo ? quantidade : 1
          );

          novo.set(complementoId, novosAdicionais);
        } else {
          // Adicionar ou atualizar adicional
          const compSelecoes = novo.get(complementoId) || new Map<number, number>();

          // Validar máximo de itens do complemento
          if (complemento.maximo_itens && complemento.maximo_itens > 0) {
            const totalItens = Array.from(compSelecoes.values()).reduce(
              (sum, qtd) => sum + qtd,
              0
            );
            const quantidadeAtual = compSelecoes.get(adicionalId) || 0;
            const totalAposAtualizacao = totalItens - quantidadeAtual + quantidade;

            if (totalAposAtualizacao > complemento.maximo_itens) {
              // Ajustar quantidade para não exceder o máximo
              const quantidadePermitida =
                complemento.maximo_itens - (totalItens - quantidadeAtual);
              if (quantidadePermitida <= 0) return prev; // Já atingiu o máximo
              quantidade = quantidadePermitida;
            }
          }

          compSelecoes.set(
            adicionalId,
            complemento.quantitativo ? quantidade : 1
          );
          novo.set(complementoId, compSelecoes);
        }

        return novo;
      });
    },
    [complementos]
  );

  /**
   * Incrementa a quantidade de um adicional
   */
  const incrementarAdicional = useCallback(
    (complementoId: number, adicionalId: number) => {
      const compSelecoes = selecoes.get(complementoId);
      const quantidadeAtual = compSelecoes?.get(adicionalId) || 0;
      selecionarAdicional(complementoId, adicionalId, quantidadeAtual + 1);
    },
    [selecoes, selecionarAdicional]
  );

  /**
   * Decrementa a quantidade de um adicional
   */
  const decrementarAdicional = useCallback(
    (complementoId: number, adicionalId: number) => {
      const compSelecoes = selecoes.get(complementoId);
      const quantidadeAtual = compSelecoes?.get(adicionalId) || 0;
      if (quantidadeAtual > 0) {
        selecionarAdicional(complementoId, adicionalId, quantidadeAtual - 1);
      }
    },
    [selecoes, selecionarAdicional]
  );

  /**
   * Toggle de um adicional (para complementos que não permitem múltipla escolha)
   */
  const toggleAdicional = useCallback(
    (complementoId: number, adicionalId: number) => {
      const compSelecoes = selecoes.get(complementoId);
      const quantidadeAtual = compSelecoes?.get(adicionalId) || 0;

      if (quantidadeAtual > 0) {
        selecionarAdicional(complementoId, adicionalId, 0);
      } else {
        selecionarAdicional(complementoId, adicionalId, 1);
      }
    },
    [selecoes, selecionarAdicional]
  );

  /**
   * Obtém a quantidade selecionada de um adicional
   */
  const getQuantidade = useCallback(
    (complementoId: number, adicionalId: number): number => {
      return selecoes.get(complementoId)?.get(adicionalId) || 0;
    },
    [selecoes]
  );

  /**
   * Limpa todas as seleções
   */
  const limparSelecao = useCallback(() => {
    setSelecoes(new Map());
  }, []);

  /**
   * Converte as seleções para o formato CartItemComplemento[]
   */
  const converterParaCartItemComplementos = useCallback((): CartItemComplemento[] => {
    const resultado: CartItemComplemento[] = [];

    selecoes.forEach((adicionaisSelecoes, complementoId) => {
      const complemento = complementos.find((c) => c.id === complementoId);
      if (!complemento) return;

      const adicionais: CartItemAdicionalComplemento[] = [];

      adicionaisSelecoes.forEach((quantidade, adicionalId) => {
        if (quantidade > 0) {
          const adicional = complemento.adicionais.find((a) => a.id === adicionalId);
          if (adicional) {
            adicionais.push({
              adicional_id: adicional.id,
              quantidade,
              adicional_nome: adicional.nome,
              adicional_preco: adicional.preco,
            });
          }
        }
      });

      if (adicionais.length > 0) {
        resultado.push({
          complemento_id: complementoId,
          adicionais,
          complemento_nome: complemento.nome,
        });
      }
    });

    return resultado;
  }, [selecoes, complementos]);

  /**
   * Calcula o preço total dos complementos selecionados
   */
  const calcularPrecoTotal = useMemo(() => {
    let total = 0;

    selecoes.forEach((adicionaisSelecoes, complementoId) => {
      const complemento = complementos.find((c) => c.id === complementoId);
      if (!complemento) return;

      adicionaisSelecoes.forEach((quantidade, adicionalId) => {
        if (quantidade > 0) {
          const adicional = complemento.adicionais.find((a) => a.id === adicionalId);
          if (adicional) {
            total += adicional.preco * quantidade;
          }
        }
      });
    });

    return total;
  }, [selecoes, complementos]);

  /**
   * Valida se todos os complementos obrigatórios foram selecionados
   */
  const validar = useCallback((): { valido: boolean; erro?: string } => {
    // Converter seleções para formato CartItemComplemento para validação
    const complementosSelecionados = new Map<number, CartItemComplemento>();

    selecoes.forEach((adicionaisSelecoes, complementoId) => {
      const adicionais: CartItemAdicionalComplemento[] = [];

      adicionaisSelecoes.forEach((quantidade, adicionalId) => {
        if (quantidade > 0) {
          const complemento = complementos.find((c) => c.id === complementoId);
          const adicional = complemento?.adicionais.find((a) => a.id === adicionalId);
          if (adicional) {
            adicionais.push({
              adicional_id: adicional.id,
              quantidade,
              adicional_nome: adicional.nome,
              adicional_preco: adicional.preco,
            });
          }
        }
      });

      if (adicionais.length > 0) {
        complementosSelecionados.set(complementoId, {
          complemento_id: complementoId,
          adicionais,
        });
      }
    });

    return validarComplementosObrigatorios(complementos, complementosSelecionados);
  }, [selecoes, complementos]);

  return {
    selecoes,
    selecionarAdicional,
    incrementarAdicional,
    decrementarAdicional,
    toggleAdicional,
    getQuantidade,
    limparSelecao,
    converterParaCartItemComplementos,
    calcularPrecoTotal,
    validar,
  };
}

