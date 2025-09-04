"use client";
import React, { useCallback, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CircleArrowLeft } from "lucide-react";
import { useScrollSpy } from "@cardapio/hooks/useScrollSpy";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import ProductsSection from "@cardapio/components/Shared/product/ProductsSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import { useCategoriaPorSlug } from "@cardapio/services/useQueryHome";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import { HorizontalSpy } from "@cardapio/components/Shared/scrollspy/HorizontalScrollSpy";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const router = useRouter();

  const empresa_id = getEmpresaId();
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = useMemo(() => {
    const raw = Array.isArray(params.slug) ? params.slug.at(-1) : params.slug;
    return (raw ?? "").trim().toLowerCase();
  }, [params.slug]);

  // ⬇️ usa o endpoint novo
  const { data, isLoading } = useCategoriaPorSlug(empresa_id, slugAtual);
  const categoriaAtual = data?.categoria ?? null;
  const subcategorias = data?.subcategorias ?? [];

  // Sheet
  const openSheet = useCallback((p: ProdutoEmpMini) => {
    setProdutoSelecionado(p);
    setSheetOpen(true);
  }, []);

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
    document.getElementById(`secao-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!categoriaAtual) {
    return <div className="p-6 w-full text-center text-muted-foreground">Categoria não encontrada.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <Button onClick={router.back} variant="link" className="mr-auto">
        <CircleArrowLeft /> Voltar
      </Button>

      <main className="flex-1 p-2">
        <HorizontalSpy items={vitrinesMeta} activeId={activeId} onClickItem={scrollToSection} />

        <CategoryScrollSection
          categorias={subcategorias}
          parentId={categoriaAtual.id}
          empresaId={empresa_id!}
        />

        <ProductsSection
          codCategoria={categoriaAtual.id}
          empresaId={empresa_id!}
          isHome={false}
          onOpenSheet={openSheet}
          onMeta={setVitrinesMeta}
          sectionRefFactory={register}
        />

        {subcategorias && data?.vitrines_filho?.map((vit) => (
          <ProductsVitrineSection
            key={vit.id}
            vitrineId={vit.id}
            titulo={vit.titulo}
            produtos={vit.produtos}
            codCategoria={vit.cod_categoria}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            hrefCategoria={vit.href_categoria}
            isHome={true}  // se não for contexto da home
          />
        ))}


        <CardAddVitrine cod_categoria={categoriaAtual.id} is_home={false} />
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
