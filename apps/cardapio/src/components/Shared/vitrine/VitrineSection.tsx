"use client";
import React, { useCallback } from "react";
import ProductsSection from "../product/ProductsSection";
import { VitrineComProdutosResponse } from "@cardapio/services/useQueryHome";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

interface Props {
  vitrinesFilho: VitrineComProdutosResponse[];
  empresaId: number;
  onOpenSheet: (produto: ProdutoEmpMini) => void;
  onMeta?: (items: { id: number; titulo: string }[]) => void;
  sectionRefFactory?: (id: number) => (el: HTMLDivElement | null) => void;
}


export default function SubcategoryVitrineSection({
  vitrinesFilho,
  empresaId,
  onOpenSheet,
  onMeta,
  sectionRefFactory,
}: Props) {
  return (
    <>
      {vitrinesFilho.map((vit) => (
        <ProductsSection
          key={vit.id}
          codCategoria={vit.cod_categoria}
          empresaId={empresaId}
          isHome={false}
          produtos={vit.produtos}
          sectionRefFactory={sectionRefFactory} // já é do tipo correto
          onOpenSheet={onOpenSheet}
          onMeta={onMeta}
          />
      ))}
    </>
  );
}

