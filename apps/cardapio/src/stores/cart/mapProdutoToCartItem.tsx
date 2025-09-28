// src/utils/mapProdutoToCartItem.ts
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { CartItem } from "@cardapio/stores/cart/useCart";

export function mapProdutoToCartItem(
  produto: ProdutoEmpMini,
  quantity: number,
  observacao?: string
): CartItem {
  return {
    cod_barras: produto.cod_barras, 
    nome: produto.produto.descricao,
    preco: produto.preco_venda,
    quantity,
    empresaId: produto.empresa,
    imagem: produto.produto.imagem ?? null,
    categoriaId: produto.produto.cod_categoria,
    subcategoriaId: produto.subcategoria_id,
    observacao,
  };
}
