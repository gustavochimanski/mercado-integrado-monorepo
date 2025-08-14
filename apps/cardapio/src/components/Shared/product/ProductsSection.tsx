"use client";
import { useEffect, useMemo, useRef } from "react";
import LoadingSpinner from "../ui/loader";
import ProductsVitrineSection from "./ProductsVitrineSection";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { useProdutosVitrinePorCategoria } from "@cardapio/services/useQueryHome";

interface Props {
  codCategoria: number;
  empresaId: number;
  onOpenSheet?: (p: ProdutoEmpMini) => void;
  sectionRefFactory?: (id: number) => (el: HTMLDivElement | null) => void;
  onMeta?: React.Dispatch<React.SetStateAction<{ id: number; titulo: string }[]>>;
  isHome?: boolean;
  hrefCategoria?: string; 
}


export default function ProductsSection({
  codCategoria,
  empresaId,
  onOpenSheet,
  sectionRefFactory,
  onMeta,
  isHome = false,
  hrefCategoria
}: Props) {
  const { data: vitrines = [], isLoading } = useProdutosVitrinePorCategoria(codCategoria, empresaId);

  const meta = useMemo(() => vitrines.map((v) => ({ id: v.id, titulo: v.titulo })), [vitrines]);
  const lastJson = useRef("");

  useEffect(() => {
    if (!onMeta) return;
    const json = JSON.stringify(meta);
    if (json === lastJson.current) return;
    lastJson.current = json;
    onMeta(meta);
  }, [meta, onMeta]);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {vitrines.map((vitrine) => (
        // ProductsSection.tsx
        <ProductsVitrineSection
          key={vitrine.id}
          vitrineId={vitrine.id}
          titulo={vitrine.titulo}
          produtos={isHome ? vitrine.produtos.slice(0, 3) : vitrine.produtos}
          codCategoria={codCategoria}
          empresaId={empresaId}
          onOpenSheet={onOpenSheet}
          sectionRef={sectionRefFactory?.(vitrine.id)}
          hrefCategoria={hrefCategoria}
          isHome={isHome}
          vitrineIsHome={vitrine.is_home}   
        />

      ))}
    </>
  );
}
