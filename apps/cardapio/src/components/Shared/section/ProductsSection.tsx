// components/Shared/section/ProductsSection.tsx
"use client";
import { ProdutoEmpMini } from "../../../types/Produtos";
import ProductsVitrineSection from "./ProductsVitrineSection";
import { useProdutosVitrinePorCategoria } from "@cardapio/hooks/useCardapio";

interface Props {
  codCategoria: number;
  empresaId: number;
  categoriaLabel?: string;
  onAdd?: (p: ProdutoEmpMini) => void;
}

export default function ProductsSection({
  codCategoria,
  empresaId,
  categoriaLabel,
  onAdd,
}: Props) {
  const { data: vitrines = [], isLoading } = useProdutosVitrinePorCategoria(
    codCategoria,
    empresaId
  );

  if (isLoading) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Carregando vitrines da categoria {categoriaLabel ?? codCategoria}...
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
        />
      ))}
    </>
  );
}
