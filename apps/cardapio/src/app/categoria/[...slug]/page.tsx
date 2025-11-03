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
import { useCategoriaPorSlug } from "@cardapio/services/useQueryHome";
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
  const { data, isLoading } = useCategoriaPorSlug(empresa_id, slugAtual);
  const categoriaAtual = data?.categoria ?? null;
  const subcategorias = data?.subcategorias ?? [];

  // ScrollSpy
  const { activeId, register } = useScrollSpy<number>();
  const [vitrinesMeta, setVitrinesMeta] = useState<{ id: number; titulo: string }[]>([]);
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

  // Atualiza meta das vitrines quando data muda
  useEffect(() => {
    const vitrinesParaMeta = vitrinesFiltradas.concat(vitrinesFilhoFiltradas);
    if (vitrinesParaMeta.length > 0) {
      setVitrinesMeta(vitrinesParaMeta.map(v => ({ id: v.id, titulo: v.titulo })));
    } else {
      setVitrinesMeta([]);
    }
  }, [vitrinesFiltradas, vitrinesFilhoFiltradas]);

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

  if (isLoading) {
    return (
      <div className="p-6 w-full h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!categoriaAtual) {
    return <div className="p-6 w-full h-min-screen text-center text-muted-foreground">Categoria não encontrada</div>;
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
            codCategoria={vitrine.cod_categoria}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            sectionRef={register(vitrine.id)}
            hrefCategoria={vitrine.href_categoria}
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
            codCategoria={vit.cod_categoria}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            sectionRef={register(vit.id)}
            hrefCategoria={vit.href_categoria}
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
