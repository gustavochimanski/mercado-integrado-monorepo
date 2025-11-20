"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { useCategoriaPorSlug } from "@cardapio/services/home";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import { HorizontalSpy } from "@cardapio/components/Shared/scrollspy/HorizontalScrollSpy";
import HeaderComponent from "@cardapio/components/Shared/Header";

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
  const { data, isLoading, isPending } = useCategoriaPorSlug(empresa_id, slugAtual);
  const categoriaAtual = data?.categoria ?? null;
  const subcategorias = data?.subcategorias ?? [];

  // Verificar se está carregando de forma consistente entre servidor e cliente
  const isDataLoading = isLoading || isPending || (!data && !!empresa_id && !!slugAtual);

  // ScrollSpy
  const { activeId, register } = useScrollSpy<number>();
  const scrollToSection = useCallback((id: number) => {
    document.getElementById(`secao-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Mostrar todas as vitrines da categoria atual, independente de is_home
  // Vitrines com is_home=true aparecem tanto na home quanto na categoria
  const vitrinesFiltradas = useMemo(
    () => data?.vitrines ?? [],
    [data?.vitrines]
  );

  // Vitrines das subcategorias, excluindo is_home=true e duplicatas
  const vitrineIdsJaExibidas = useMemo(
    () => new Set(vitrinesFiltradas.map((v) => v.id)),
    [vitrinesFiltradas]
  );

  const vitrinesFilhoFiltradas = useMemo(
    () =>
      subcategorias && data?.vitrines_filho
        ? data.vitrines_filho.filter(
            (vit) => !vitrineIdsJaExibidas.has(vit.id)
          )
        : [],
    [subcategorias, data?.vitrines_filho, vitrineIdsJaExibidas]
  );

  const vitrinesMeta = useMemo(
    () =>
      [...vitrinesFiltradas, ...vitrinesFilhoFiltradas].map((v) => ({
        id: v.id,
        titulo: v.titulo,
      })),
    [vitrinesFiltradas, vitrinesFilhoFiltradas]
  );

  // Sheet
  const openSheet = useCallback((p: ProdutoEmpMini) => {
    setProdutoSelecionado(p);
    setSheetOpen(true);
  }, []);

  const add = useCart((s) => s.add);
  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number, observacao?: string, adicionais_ids?: number[]) => {
      add(mapProdutoToCartItem(produto, quantity, observacao, adicionais_ids));
      setSheetOpen(false);
    },
    [add]
  );

  if (isDataLoading) {
    return (
      <div className="p-6 w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categoriaAtual) {
    return (
      <div className="p-6 w-full h-screen flex items-center justify-center text-center text-muted-foreground">
        Categoria não encontrada
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <HeaderComponent/>

      <main className="flex-1 px-2 pt-2 pb-2">
        {vitrinesMeta.length > 0 && (
          <HorizontalSpy
            key={`spy-${categoriaAtual.id}-${vitrinesMeta.length}`}
            items={vitrinesMeta}
            activeId={activeId}
            onClickItem={scrollToSection}
          />
        )}

        <CategoryScrollSection
          categorias={subcategorias}
          parentId={categoriaAtual.id}
          empresaId={empresa_id!}
        />

        {/* Usar vitrines já carregadas ao invés de ProductsSection */}
        {/* Mostrar todas as vitrines da categoria atual */}
        {vitrinesFiltradas.map((vitrine) => (
          <ProductsVitrineSection
            key={vitrine.id}
            vitrineId={vitrine.id}
            titulo={vitrine.titulo}
            produtos={vitrine.produtos}
            combos={vitrine.combos}
            receitas={vitrine.receitas}
            codCategoria={vitrine.cod_categoria}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            sectionRef={register(vitrine.id)}
            hrefCategoria={vitrine.href_categoria ?? undefined}
            isHome={false}
            vitrineIsHome={vitrine.is_home}
          />
        ))}

        {/* Vitrines das subcategorias (apenas as primeiras de cada subcategoria) */}
        {/* Evitar duplicatas já exibidas em vitrines acima */}
        {vitrinesFilhoFiltradas.map((vit) => (
          <ProductsVitrineSection
            key={vit.id}
            vitrineId={vit.id}
            titulo={vit.titulo}
            produtos={vit.produtos}
            combos={vit.combos}
            receitas={vit.receitas}
            codCategoria={vit.cod_categoria}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            sectionRef={register(vit.id)}
            hrefCategoria={vit.href_categoria ?? undefined}
            isHome={false}
            vitrineIsHome={vit.is_home}
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
