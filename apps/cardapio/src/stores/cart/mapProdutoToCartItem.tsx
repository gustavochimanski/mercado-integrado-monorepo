// src/utils/mapProdutoToCartItem.ts
import { ProdutoEmpMini, AdicionalMini } from "@cardapio/types/Produtos";
import { CartItem, CartItemAdicional } from "@cardapio/stores/cart/useCart";

export function mapProdutoToCartItem(
  produto: ProdutoEmpMini,
  quantity: number,
  observacao?: string,
  adicionais_ids?: number[]
): CartItem {
  // Buscar dados dos adicionais a partir dos IDs
  const adicionaisDoProduto = produto.produto?.adicionais || produto.adicionais || [];
  const adicionaisMap = new Map<number, AdicionalMini>();
  
  // Criar mapa de adicionais por ID
  adicionaisDoProduto.forEach(adicional => {
    adicionaisMap.set(adicional.id, adicional);
  });

  // Converter IDs para dados completos dos adicionais
  const adicionais: CartItemAdicional[] = [];
  if (adicionais_ids && adicionais_ids.length > 0) {
    // Contar quantidades de cada adicional
    const quantidadePorId = new Map<number, number>();
    adicionais_ids.forEach(id => {
      quantidadePorId.set(id, (quantidadePorId.get(id) || 0) + 1);
    });

    // Criar array de adicionais com quantidades
    quantidadePorId.forEach((quantidade, id) => {
      const adicional = adicionaisMap.get(id);
      if (adicional) {
        // Adicionar uma entrada para cada quantidade
        for (let i = 0; i < quantidade; i++) {
          adicionais.push({
            id: adicional.id,
            nome: adicional.descricao,
            preco: adicional.preco,
          });
        }
      }
    });
  }

  return {
    cod_barras: produto.cod_barras, 
    nome: produto.produto.descricao,
    preco: produto.preco_venda,
    quantity,
    empresaId: produto.empresa_id ?? produto.empresa ?? 0,
    imagem: produto.produto.imagem ?? null,
    categoriaId: produto.produto.cod_categoria ?? undefined,
    subcategoriaId: produto.subcategoria_id ?? 0,
    observacao,
    adicionais_ids, // Manter para compatibilidade
    adicionais, // Dados completos para exibição
  };
}
