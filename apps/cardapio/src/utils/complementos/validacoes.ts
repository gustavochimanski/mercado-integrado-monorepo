/**
 * Funções de validação para complementos
 * 
 * Centraliza todas as validações relacionadas a complementos
 * para garantir consistência em todo o projeto.
 */

import type { ComplementoResponse } from "@cardapio/types/complementos";
import type { CartItemComplemento } from "@cardapio/stores/cart/useCart";
import type { ValidacaoComplementosResult } from "@cardapio/types/complementos";

/**
 * Valida se todos os complementos obrigatórios foram selecionados
 * e se as quantidades mínimas/máximas foram respeitadas
 * 
 * @param complementos - Array de complementos disponíveis
 * @param complementosSelecionados - Map de complementos selecionados (complemento_id -> CartItemComplemento)
 * @returns Resultado da validação com mensagem de erro se houver
 * 
 * @example
 * ```ts
 * const validacao = validarComplementosObrigatorios(complementos, complementosSelecionados);
 * if (!validacao.valido) {
 *   console.error(validacao.erro);
 * }
 * ```
 */
export function validarComplementosObrigatorios(
  complementos: ComplementoResponse[],
  complementosSelecionados: Map<number, CartItemComplemento>
): ValidacaoComplementosResult {
  for (const complemento of complementos) {
    if (complemento.obrigatorio) {
      const selecionado = complementosSelecionados.get(complemento.id);

      if (!selecionado || selecionado.adicionais.length === 0) {
        return {
          valido: false,
          erro: `É obrigatório selecionar ao menos um item em "${complemento.nome}"`,
        };
      }

      // Validar quantidade mínima
      if (complemento.minimo_itens && complemento.minimo_itens > 0) {
        const totalItens = selecionado.adicionais.reduce(
          (sum, ad) => sum + ad.quantidade,
          0
        );

        if (totalItens < complemento.minimo_itens) {
          return {
            valido: false,
            erro: `É necessário selecionar pelo menos ${complemento.minimo_itens} item(s) em "${complemento.nome}"`,
          };
        }
      }

      // Validar quantidade máxima
      if (complemento.maximo_itens && complemento.maximo_itens > 0) {
        const totalItens = selecionado.adicionais.reduce(
          (sum, ad) => sum + ad.quantidade,
          0
        );

        if (totalItens > complemento.maximo_itens) {
          return {
            valido: false,
            erro: `É possível selecionar no máximo ${complemento.maximo_itens} item(s) em "${complemento.nome}"`,
          };
        }
      }
    }
  }

  return { valido: true };
}

/**
 * Verifica se um complemento permite múltipla escolha
 * 
 * @param complemento - Complemento a verificar
 * @returns true se permite múltipla escolha, false caso contrário
 */
export function permiteMultiplaEscolha(
  complemento: ComplementoResponse
): boolean {
  return complemento.permite_multipla_escolha;
}

/**
 * Verifica se um complemento é quantitativo (permite quantidade > 1)
 * 
 * @param complemento - Complemento a verificar
 * @returns true se é quantitativo, false caso contrário
 */
export function permiteQuantidade(
  complemento: ComplementoResponse
): boolean {
  return complemento.quantitativo;
}

/**
 * Verifica se um complemento é obrigatório
 * 
 * @param complemento - Complemento a verificar
 * @returns true se é obrigatório, false caso contrário
 */
export function isObrigatorio(
  complemento: ComplementoResponse
): boolean {
  return complemento.obrigatorio;
}

