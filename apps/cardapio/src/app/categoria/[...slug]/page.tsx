"use client";
import React, { useCallback, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useHome } from "@cardapio/services/useQueryHome";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { useScrollSpy } from "@cardapio/hooks/useScrollSpy";
import { HorizontalSpy } from "@cardapio/components/Shared/HorizontalScrollSpy";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import ProductsSection from "@cardapio/components/Shared/product/ProductsSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const router = useRouter();

  const empresa_id = getEmpresaId();
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = Array.isArray(params.slug)
    ? params.slug[params.slug.length - 1]
    : (params.slug ?? "");

  const { data, isLoading } = useHome(empresa_id || 0, false);
  const categorias = data?.categorias ?? [];

  const categoriaAtual = useMemo(
    () => categorias.find((cat) => cat.slug === slugAtual),
    [categorias, slugAtual]
  );

  const subcategorias = useMemo(
    () => categorias.filter((cat) => cat.parent_id === categoriaAtual?.id),
    [categorias, categoriaAtual]
  );

  // abre o sheet
  const openSheet = useCallback((produto: ProdutoEmpMini) => {
    setProdutoSelecionado(produto);
    setSheetOpen(true);
  }, []);

  // adiciona no carrinho
  const add = useCart((s) => s.add);
  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number) => {
      add(mapProdutoToCartItem(produto, quantity));
      setSheetOpen(false);
    },
    [add]
  );

  // ScrollSpy
  const { activeId, register } = useScrollSpy<number>();
  const [vitrinesMeta, setVitrinesMeta] = useState<{ id: number; titulo: string }[]>([]);

  const scrollToSection = useCallback((id: number) => {
    document
      .getElementById(`secao-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 w-full flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categoriaAtual) {
    return (
      <div className="p-6 w-full text-center text-muted-foreground">
        Categoria não encontrada.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Button onClick={router.back} variant="link" className="mr-auto">
        <CircleArrowLeft /> Voltar
      </Button>

      <main className="flex-1 p-2">
        <HorizontalSpy
          items={vitrinesMeta}
          activeId={activeId}
          onClickItem={scrollToSection}
        />

        <CategoryScrollSection
          categorias={subcategorias}
          parentId={categoriaAtual.id}
          empresaId={empresa_id}
        />

        <ProductsSection
          codCategoria={categoriaAtual.id}
          empresaId={empresa_id}
          onOpenSheet={openSheet}
          sectionRefFactory={register}
          onMeta={setVitrinesMeta}
          isHome={true}
        />

        <CardAddVitrine
          empresa_id={empresa_id}
          cod_categoria={categoriaAtual.id}
          is_home={false}
        />
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
