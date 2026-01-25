"use client";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { ProductCard } from "./ProductCard";
import { useCart } from "@cardapio/stores/cart/useCart";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { toast } from "sonner";

type Props = {
  produto: ProdutoEmpMini;
  quantity?: number;
  openSheet?: (p: ProdutoEmpMini) => void;
};

export function AddableProductCard({ produto, quantity = 1, openSheet }: Props) {
  const add = useCart((s) => s.add);
  const { estaAberta } = useLojaAberta();

  function handleAdd() {
    if (!estaAberta) {
      toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
      return;
    }
    
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
