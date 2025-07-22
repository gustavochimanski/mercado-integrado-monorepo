// components/Shared/section/ProductsSection.tsx
"use client";
import { useEffect, useMemo, useRef } from "react";
import { ProdutoEmpMini } from "../../../types/Produtos";
import LoadingSpinner from "../ui/loader";
import ProductsVitrineSection from "./ProductsVitrineSection";
import { useProdutosVitrinePorCategoria } from "@cardapio/hooks/useCardapio";

interface Props {
  codCategoria: number;
  empresaId: number;
  categoriaLabel?: string;
  onAdd?: (p: ProdutoEmpMini) => void;
  sectionRefFactory?: (id: number) => (el: HTMLElement | null) => void;
  onMeta?: React.Dispatch<React.SetStateAction<{ id: number; titulo: string }[]>>;
}

export default function ProductsSection({
  codCategoria,
  empresaId,
  categoriaLabel,
  onAdd,
  sectionRefFactory,
  onMeta,
}: Props) {
  const { data: vitrines = [], isLoading } = useProdutosVitrinePorCategoria(codCategoria, empresaId);

  const meta = useMemo(() => vitrines.map((v) => ({ id: v.id, titulo: v.titulo })), [vitrines]);
  const lastJson = useRef("");

  useEffect(() => {
    if (!onMeta) return;
    const json = JSON.stringify(meta);
    if (json === lastJson.current) return; // evita loop
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
          onAdd={onAdd}
          sectionRef={sectionRefFactory?.(vitrine.id)}
        />
      ))}
    </>
  );
}