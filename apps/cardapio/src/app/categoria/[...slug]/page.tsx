"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { useScrollSpy } from "@cardapio/hooks/useScrollSpy";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import { useCategoriaPorSlug } from "@cardapio/services/home";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import { HorizontalSpy } from "@cardapio/components/Shared/scrollspy/HorizontalScrollSpy";
import { LoginWrapper } from "@cardapio/components/auth/LoginWrapper";
import { filterCategoriasBySearch, filterVitrinesBySearch } from "@cardapio/lib/filter-by-search";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { toast } from "sonner";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const redirecionaCategoria = searchParams.get("redireciona_categoria") === "true";

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
  const [scrollingToId, setScrollingToId] = useState<number | null>(null);
  const [highlightedVitrineId, setHighlightedVitrineId] = useState<number | null>(null);
  const scrollLockTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const highlightTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToSection = useCallback((id: number) => {
    if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current);
    if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);

    setScrollingToId(id);
    setHighlightedVitrineId(id);

    document.getElementById(`secao-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

    scrollLockTimerRef.current = setTimeout(() => {
      scrollLockTimerRef.current = null;
      setScrollingToId(null);
    }, 700);

    // Manter destaque por 2 segundos após o scroll terminar
    highlightTimerRef.current = setTimeout(() => {
      setHighlightedVitrineId(null);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const vitrinesRaw = data?.vitrines ?? [];
  const vitrinesFilhoRaw = useMemo(
    () =>
      subcategorias && data?.vitrines_filho
        ? data.vitrines_filho.filter(
            (vit) => !new Set(vitrinesRaw.map((v) => v.id)).has(vit.id)
          )
        : [],
    [subcategorias, data?.vitrines_filho, vitrinesRaw]
  );

  const vitrinesFiltradas = useMemo(
    () => filterVitrinesBySearch(vitrinesRaw, q),
    [vitrinesRaw, q]
  );
  const vitrinesFilhoFiltradas = useMemo(
    () => filterVitrinesBySearch(vitrinesFilhoRaw, q),
    [vitrinesFilhoRaw, q]
  );

  const subcategoriasFiltradas = useMemo(
    () => filterCategoriasBySearch(subcategorias, q),
    [subcategorias, q]
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
  const { estaAberta } = useLojaAberta();
  const handleAdd = useCallback(
    (produto: ProdutoEmpMini, quantity: number, observacao?: string, complementos?: import("@cardapio/stores/cart/useCart").CartItemComplemento[]) => {
      // Bloquear adição se loja estiver fechada
      if (!estaAberta) {
        toast.error("A loja está fechada no momento. Não é possível adicionar itens ao carrinho.");
        return;
      }

      // Se houver complementos, usar diretamente; caso contrário, criar item sem complementos
      if (complementos && complementos.length > 0) {
        add({
          cod_barras: produto.cod_barras,
          nome: produto.produto.descricao,
          preco: produto.preco_venda,
          quantity,
          empresaId: produto.empresa_id ?? produto.empresa ?? 0,
          imagem: produto.produto.imagem ?? null,
          categoriaId: produto.produto.cod_categoria ?? undefined,
          subcategoriaId: produto.subcategoria_id ?? 0,
          observacao,
          complementos,
        });
      } else {
        add(mapProdutoToCartItem(produto, quantity, observacao));
      }
      setSheetOpen(false);
    },
    [add, estaAberta]
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
    <div className="min-h-screen flex flex-col">
      <LoginWrapper />

      <main className="flex-1 px-2 pb-2">
        {vitrinesMeta.length > 0 && (
          <HorizontalSpy
            key={`spy-${categoriaAtual.id}-${vitrinesMeta.length}`}
            items={vitrinesMeta}
            activeId={scrollingToId ?? activeId}
            onClickItem={scrollToSection}
          />
        )}

        <CategoryScrollSection
          categorias={subcategoriasFiltradas}
          parentId={categoriaAtual.id}
          empresaId={empresa_id!}
        />

        {/* Usar vitrines já carregadas ao invés de ProductsSection */}
        {/* Mostrar todas as vitrines da categoria atual */}
        {vitrinesFiltradas.map((vitrine, index) => (
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
            isHighlighted={highlightedVitrineId === vitrine.id}
            isLast={vitrinesFilhoFiltradas.length === 0 && index === vitrinesFiltradas.length - 1}
          />
        ))}

        {/* Vitrines das subcategorias (apenas as primeiras de cada subcategoria) */}
        {/* Evitar duplicatas já exibidas em vitrines acima */}
        {vitrinesFilhoFiltradas.map((vit, index) => (
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
            isHighlighted={highlightedVitrineId === vit.id}
            isLast={index === vitrinesFilhoFiltradas.length - 1}
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
