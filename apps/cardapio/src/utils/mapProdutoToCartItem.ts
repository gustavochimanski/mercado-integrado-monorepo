// src/utils/mapProdutoToCartItem.ts

import { CartItem } from "@cardapio/stores/cart/useCart";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

export const mapProdutoToCartItem = (p: ProdutoEmpMini, quantity = 1): CartItem => ({
  id: String(p.produto.id),
  nome: p.produto.descricao,
  preco: p.preco_venda,
  quantity,
  empresaId: p.empresa,
  imagem: p.produto.imagem,
  categoriaId: p.produto.cod_categoria,
  subcategoriaId: p.subcategoria_id,
});
