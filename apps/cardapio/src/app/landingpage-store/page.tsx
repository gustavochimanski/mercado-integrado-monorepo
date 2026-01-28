"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { useScrollSpy } from "@cardapio/hooks/useScrollSpy";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import { HorizontalSpy } from "@cardapio/components/Shared/scrollspy/HorizontalScrollSpy";
import { filterVitrinesBySearch } from "@cardapio/lib/filter-by-search";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { toast } from "sonner";
import { useLandingpageStore } from "@cardapio/services/home";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { useBanners } from "@cardapio/services/banners";
import { BannerVertical, BannersHorizontal } from "@cardapio/components/Shared/parceiros/Banners";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useMutateCliente } from "@cardapio/services/cliente";
import { useAutoLoginFromClientNumber } from "@cardapio/lib/params/useAutoLoginFromClientNumber";
// Garantir que apiAdmin carregue na rota: ready_for_token (login admin iframe) quando via=supervisor
import "@cardapio/app/api/apiAdmin";

export default function LandingpageStorePage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const { isAdmin } = useUserContext();
  const { loginDireto } = useMutateCliente();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const isHome = searchParams.get("is_home") === "true";

  // ✅ Auto-login via `?client_number=...`
  useAutoLoginFromClientNumber(loginDireto);

  useReceiveEmpresaFromQuery();
  const empresaParam = searchParams.get("empresa");
  const empresaIdFromUrl = useMemo(() => {
    const raw = (empresaParam ?? "").trim();
    if (!raw || !/^\d+$/.test(raw)) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [empresaParam]);
  const empresa_id = empresaIdFromUrl ?? getEmpresaId();

  const { data, isLoading, isPending } = useLandingpageStore(empresa_id, isHome);
  const vitrinesRaw = data?.vitrines ?? [];

  const { data: data_banners } = useBanners(!!empresa_id);
  const bannersVerticais = (data_banners ?? []).filter((b) => b.tipo_banner === "V" && b.ativo);
  const bannerVerticalPrincipal = bannersVerticais.length > 0 ? bannersVerticais[0] : null;

  // Verificar se está carregando de forma consistente entre servidor e cliente
  const isDataLoading = isLoading || isPending || (!data && !!empresa_id);

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

  const vitrinesFiltradas = useMemo(() => filterVitrinesBySearch(vitrinesRaw, q), [vitrinesRaw, q]);

  const vitrinesMeta = useMemo(
    () =>
      vitrinesFiltradas.map((v) => ({
        id: v.id,
        titulo: v.titulo,
      })),
    [vitrinesFiltradas]
  );

  // Sheet
  const openSheet = useCallback((p: ProdutoEmpMini) => {
    setProdutoSelecionado(p);
    setSheetOpen(true);
  }, []);

  const add = useCart((s) => s.add);
  const { estaAberta } = useLojaAberta();
  const handleAdd = useCallback(
    (
      produto: ProdutoEmpMini,
      quantity: number,
      observacao?: string,
      complementos?: import("@cardapio/stores/cart/useCart").CartItemComplemento[]
    ) => {
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

  if (!data || vitrinesRaw.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 px-2 pb-2">
          <BannerVertical banner={bannerVerticalPrincipal} isAdmin={isAdmin} />
          <BannersHorizontal banners={data_banners ?? []} isAdmin={isAdmin} />

          <div className="p-6 w-full flex items-center justify-center text-center text-muted-foreground">
            Nenhuma vitrine encontrada
          </div>

          {/* Mesmo sem vitrines, o admin precisa conseguir criar a primeira */}
          <CardAddVitrine cod_categoria={null} is_home={false} className="mt-2" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-2 pb-2">
        {vitrinesMeta.length > 0 && (
          <HorizontalSpy items={vitrinesMeta} activeId={scrollingToId ?? activeId} onClickItem={scrollToSection} />
        )}

        <BannerVertical banner={bannerVerticalPrincipal} isAdmin={isAdmin} />

        {vitrinesFiltradas.map((vitrine, index) => (
          <ProductsVitrineSection
            key={vitrine.id}
            vitrineId={vitrine.id}
            titulo={vitrine.titulo}
            produtos={vitrine.produtos}
            combos={vitrine.combos}
            receitas={vitrine.receitas}
            codCategoria={null}
            empresaId={empresa_id!}
            onOpenSheet={openSheet}
            sectionRef={register(vitrine.id)}
            isHome={false}
            vitrineIsHome={vitrine.is_home}
            isHighlighted={highlightedVitrineId === vitrine.id}
            isLast={index === vitrinesFiltradas.length - 1}
          />
        ))}

        <BannersHorizontal banners={data_banners ?? []} isAdmin={isAdmin} />

        {/* Landing page store não tem vínculo com categoria */}
        <CardAddVitrine cod_categoria={null} is_home={false} />
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

