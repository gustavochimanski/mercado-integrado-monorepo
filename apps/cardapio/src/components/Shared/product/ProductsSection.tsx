"use client";
import { useEffect, useMemo, useRef } from "react";
import LoadingSpinner from "../ui/loader";
import ProductsVitrineSection from "./ProductsVitrineSection";
import { useProdutosVitrinePorCategoria } from "@cardapio/hooks/useCardapio";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

interface Props {
  codCategoria: number;
  empresaId: number;
  onOpenSheet?: (p: ProdutoEmpMini) => void;
  sectionRefFactory?: (id: number) => (el: HTMLDivElement | null) => void;
  onMeta?: React.Dispatch<React.SetStateAction<{ id: number; titulo: string }[]>>;
  isAdmin?: boolean;
}

export default function ProductsSection({
  codCategoria,
  empresaId,
  onOpenSheet,
  sectionRefFactory,
  onMeta,
  isAdmin,
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
        <ProductsVitrineSection
          key={vitrine.id}
          vitrineId={vitrine.id}
          titulo={vitrine.titulo}
          produtos={vitrine.produtos}
          codCategoria={codCategoria}
          empresaId={empresaId}
          onOpenSheet={onOpenSheet}
          sectionRef={sectionRefFactory?.(vitrine.id)}
          isAdmin={isAdmin}
        />
      ))}
    </>
  );
}
