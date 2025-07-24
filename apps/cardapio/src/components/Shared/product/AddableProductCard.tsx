"use client";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { ProductCard } from "./ProductCard";
import { useCart } from "@cardapio/stores/cart/useCart";
import { mapProdutoToCartItem } from "@cardapio/utils/mapProdutoToCartItem";

type Props = {
  produto: ProdutoEmpMini;
  quantity?: number;
  openSheet?: (p: ProdutoEmpMini) => void;
};

export function AddableProductCard({ produto, quantity = 1, openSheet }: Props) {
  const add = useCart((s) => s.add);

  function handleAdd() {
    if (openSheet) return openSheet(produto);
    add(mapProdutoToCartItem(produto, quantity));
  }

  return (
    <ProductCard
      produto={produto}
      onOpenSheet={handleAdd}
    />
  );
}
