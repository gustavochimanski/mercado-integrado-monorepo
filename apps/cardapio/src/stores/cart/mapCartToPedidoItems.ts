// src/stores/cart/mapCartToPedidoItems.ts
import type { CartItem, CartCombo, CartReceita } from "./useCart";
import type { ItemPedidoRequest, ComboPedidoRequest, ReceitaPedidoRequest, ProdutosPedidoRequest, ItemComplementoRequest } from "@cardapio/types/pedido";
import type { CartComboSection } from "../../utils/validacoesCombos";

/**
 * Interface para o resultado do mapeamento com estrutura aninhada em produtos
 */
export interface MappedPedidoItems {
  produtos: ProdutosPedidoRequest;
}

/**
 * Converte os itens do carrinho para o formato esperado pela API
 * Separando produtos, combos e receitas conforme o schema do backend
 * 
 * @param items - Array de produtos do carrinho
 * @param combos - Array de combos do carrinho
 * @param receitas - Array de receitas do carrinho
 * @returns Objeto com itens, combos e receitas separados
 */
export function mapCartToPedidoItems(
  items: CartItem[],
  combos: CartCombo[],
  receitas: CartReceita[]
): MappedPedidoItems {
  // Converter produtos para itens
  const itens: ItemPedidoRequest[] = items.map((item) => {
    const itemRequest: ItemPedidoRequest = {
      produto_cod_barras: item.cod_barras,
      quantidade: item.quantity,
    };

    if (item.observacao) {
      itemRequest.observacao = item.observacao;
    }

    // NOVO: Converter complementos para o formato esperado pela API
    if (item.complementos && item.complementos.length > 0) {
      const complementos: ItemComplementoRequest[] = item.complementos.map((complemento) => ({
        complemento_id: complemento.complemento_id,
        adicionais: complemento.adicionais.map((adicional) => ({
          adicional_id: adicional.adicional_id,
          quantidade: adicional.quantidade,
        })),
      }));
      itemRequest.complementos = complementos;
    }
    // LEGADO: Suporte para adicionais antigos (migração gradual)
    else if (item.adicionais && item.adicionais.length > 0) {
      // Migrar adicionais antigos para um complemento genérico (se necessário)
      // Por enquanto, ignoramos adicionais antigos se não houver complementos
      // Isso força a migração para a nova estrutura
    }

    return itemRequest;
  });

  // Converter combos
  const combosMapeados: ComboPedidoRequest[] = combos.map((combo) => {
    const comboRequest: ComboPedidoRequest = {
      combo_id: combo.combo_id,
      quantidade: combo.quantidade,
    };

    // NOVO: Converter complementos para o formato esperado pela API
    if (combo.complementos && combo.complementos.length > 0) {
      const complementos: ItemComplementoRequest[] = combo.complementos.map((complemento) => ({
        complemento_id: complemento.complemento_id,
        adicionais: complemento.adicionais.map((adicional) => ({
          adicional_id: adicional.adicional_id,
          quantidade: adicional.quantidade,
        })),
      }));
      comboRequest.complementos = complementos;
    }
    // LEGADO: Suporte para adicionais antigos (migração gradual)
    else if (combo.adicionais && combo.adicionais.length > 0) {
      // Migrar adicionais antigos para um complemento genérico (se necessário)
      // Por enquanto, ignoramos adicionais antigos se não houver complementos
    }
    // NOVO: Converter seções (se presentes) para o formato do backend
    if ((combo as any).secoes && Array.isArray((combo as any).secoes) && (combo as any).secoes.length > 0) {
      // espera-se que combo.secoes seja Array<{ secao_id: number, itens: Array<{ id: number, quantidade: number }> }>
      const secoes: Array<{ secao_id: number; itens: Array<{ id: number; quantidade: number }> }> = (combo as any).secoes.map((s: CartComboSection) => ({
        secao_id: s.secao_id,
        itens: (s.itens || []).map(it => ({
          id: it.id,
          quantidade: it.quantidade,
        })),
      }));

      (comboRequest as any).secoes = secoes;
    }

    return comboRequest;
  });

  // Converter receitas
  const receitasMapeadas: ReceitaPedidoRequest[] = receitas.map((receita) => {
    const receitaRequest: ReceitaPedidoRequest = {
      receita_id: receita.receita_id,
      quantidade: receita.quantidade,
    };

    // Adicionar observação se houver
    if (receita.observacao) {
      receitaRequest.observacao = receita.observacao;
    }

    // NOVO: Converter complementos para o formato esperado pela API
    if (receita.complementos && receita.complementos.length > 0) {
      const complementos: ItemComplementoRequest[] = receita.complementos.map((complemento) => ({
        complemento_id: complemento.complemento_id,
        adicionais: complemento.adicionais.map((adicional) => ({
          adicional_id: adicional.adicional_id,
          quantidade: adicional.quantidade,
        })),
      }));
      receitaRequest.complementos = complementos;
    }
    // LEGADO: Suporte para adicionais antigos (migração gradual)
    else if (receita.adicionais && receita.adicionais.length > 0) {
      // Migrar adicionais antigos para um complemento genérico (se necessário)
      // Por enquanto, ignoramos adicionais antigos se não houver complementos
    }

    return receitaRequest;
  });

  return {
    produtos: {
      itens,
      ...(combosMapeados.length > 0 && { combos: combosMapeados }),
      ...(receitasMapeadas.length > 0 && { receitas: receitasMapeadas }),
    },
  };
}

