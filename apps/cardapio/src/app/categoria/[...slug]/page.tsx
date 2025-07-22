// RouteCategoryPage.tsx
"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCardapio } from "@cardapio/hooks/useCardapio";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "@cardapio/components/Shared/ui/button";
import CategoryScrollSection from "@cardapio/components/Shared/section/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/Sheet/SheetAddProduto";
import { CircleArrowLeft } from "lucide-react";
import CardAddSecaoSubCateg from "@cardapio/components/admin/card/CardAddSecaoSubCateg";
import ProductsSection from "@cardapio/components/Shared/section/ProductsSection";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);

  const router = useRouter();
  const empresaId = 1;
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = Array.isArray(params.slug)
    ? params.slug[params.slug.length - 1]
    : params.slug ?? "";

  const { data: categorias = [], isLoading } = useCardapio(empresaId);

  const categoriaAtual = useMemo(
    () => categorias.find((cat) => cat.slug === slugAtual),
    [categorias, slugAtual]
  );
  const subcategorias = useMemo(
    () => categorias.filter((cat) => cat.slug_pai === slugAtual),
    [categorias, slugAtual]
  );

  const handleOpenSheet = useCallback((produto: ProdutoEmpMini) => {
    setProdutoSelecionado(produto);
    setSheetOpen(true);
  }, []);

  const handleAdd = useCallback((produto: ProdutoEmpMini, quantity: number) => {
    alert(`Adicionado: ${produto.produto.descricao} x${quantity}`);
    setSheetOpen(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Button onClick={router.back} variant="link" className="mr-auto">
        <CircleArrowLeft /> Voltar
      </Button>

      <main className="flex-1 p-0">
        {categoriaAtual && (
          <>
            <CategoryScrollSection
              categorias={subcategorias}
              titulo={categoriaAtual.label}
              parentSlug={categoriaAtual.slug}
              empresaId={empresaId}
            />

            <ProductsSection
              codCategoria={categoriaAtual.id}
              empresaId={empresaId}
              categoriaLabel={categoriaAtual.label}
              onAdd={handleOpenSheet}
            />

            <CardAddSecaoSubCateg
              empresaId={empresaId}
              codCategoria={categoriaAtual.id}
            />
          </>
        )}
      </main>

      {produtoSelecionado && (
        <SheetAdicionarProduto
          produto={produtoSelecionado}
          isOpen={sheetOpen}
          onAdd={handleAdd}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
