// src/stores/cart/mapCartToPedidoItems.ts
import type { CartItem, CartCombo, CartReceita } from "./useCart";
import type { ItemPedidoRequest, ComboPedidoRequest, ReceitaPedidoRequest, ProdutosPedidoRequest } from "@cardapio/types/pedido";

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
    // Agrupar adicionais por ID e contar quantidades
    const adicionaisMap = new Map<number, number>();
    if (item.adicionais && item.adicionais.length > 0) {
      item.adicionais.forEach((adicional) => {
        adicionaisMap.set(adicional.id, (adicionaisMap.get(adicional.id) || 0) + 1);
      });
    }

    // Converter para formato esperado pelo backend: [{ adicional_id, quantidade }]
    const adicionais = Array.from(adicionaisMap.entries()).map(([adicional_id, quantidade]) => ({
      adicional_id,
      quantidade,
    }));

    const itemRequest: ItemPedidoRequest = {
      produto_cod_barras: item.cod_barras,
      quantidade: item.quantity,
    };

    if (item.observacao) {
      itemRequest.observacao = item.observacao;
    }

    // Adicionar adicionais no formato correto: [{ adicional_id, quantidade }]
    if (adicionais.length > 0) {
      itemRequest.adicionais = adicionais;
    }

    return itemRequest;
  });

  // Converter combos
  const combosMapeados: ComboPedidoRequest[] = combos.map((combo) => {
    // Agrupar adicionais por ID e contar quantidades
    const adicionaisMap = new Map<number, number>();
    if (combo.adicionais && combo.adicionais.length > 0) {
      combo.adicionais.forEach((adicional) => {
        adicionaisMap.set(adicional.id, (adicionaisMap.get(adicional.id) || 0) + 1);
      });
    }

    // Converter para formato esperado pelo backend: [{ adicional_id, quantidade }]
    const adicionais = Array.from(adicionaisMap.entries()).map(([adicional_id, quantidade]) => ({
      adicional_id,
      quantidade,
    }));

    const comboRequest: ComboPedidoRequest = {
      combo_id: combo.combo_id,
      quantidade: combo.quantidade,
    };

    // Adicionar adicionais no formato correto: [{ adicional_id, quantidade }]
    if (adicionais.length > 0) {
      comboRequest.adicionais = adicionais;
    }

    return comboRequest;
  });

  // Converter receitas
  const receitasMapeadas: ReceitaPedidoRequest[] = receitas.map((receita) => {
    // Agrupar adicionais por ID e contar quantidades
    const adicionaisMap = new Map<number, number>();
    if (receita.adicionais && receita.adicionais.length > 0) {
      receita.adicionais.forEach((adicional) => {
        adicionaisMap.set(adicional.id, (adicionaisMap.get(adicional.id) || 0) + 1);
      });
    }

    // Converter para formato esperado pelo backend: [{ adicional_id, quantidade }]
    const adicionais = Array.from(adicionaisMap.entries()).map(([adicional_id, quantidade]) => ({
      adicional_id,
      quantidade,
    }));

    const receitaRequest: ReceitaPedidoRequest = {
      receita_id: receita.receita_id,
      quantidade: receita.quantidade,
    };

    // Adicionar observação se houver
    if (receita.observacao) {
      receitaRequest.observacao = receita.observacao;
    }

    // Adicionar adicionais no formato correto: [{ adicional_id, quantidade }]
    if (adicionais.length > 0) {
      receitaRequest.adicionais = adicionais;
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

