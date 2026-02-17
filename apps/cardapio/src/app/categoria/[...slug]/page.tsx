"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { useScrollSpy } from "@cardapio/hooks/useScrollSpy";
import LoadingSpinner from "@cardapio/components/Shared/ui/loader";
import CategoryScrollSection from "@cardapio/components/Shared/category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/product/SheetAddProduto";
import { ProductCard } from "@cardapio/components/Shared/product/ProductCard";
import { ReceitaCard } from "@cardapio/components/Shared/product/ReceitaCard";
import { ComboCard } from "@cardapio/components/Shared/product/ComboCard";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import CardAddVitrine from "@cardapio/components/admin/card/CardAddVitrine";
import { mapProdutoToCartItem } from "@cardapio/stores/cart/mapProdutoToCartItem";
import { useCategoriaPorSlug } from "@cardapio/services/home";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import ProductsVitrineSection from "@cardapio/components/Shared/product/ProductsVitrineSection";
import { HorizontalSpy } from "@cardapio/components/Shared/scrollspy/HorizontalScrollSpy";
import { filterCategoriasBySearch, filterVitrinesBySearch } from "@cardapio/lib/filter-by-search";
import { api } from "@cardapio/app/api/api";
import type { ReceitaMiniDTO, ComboMiniDTO } from "@cardapio/services/home/types";
import { useLojaAberta } from "@cardapio/hooks/useLojaAberta";
import { toast } from "sonner";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  // Tornar empresa_id reativo: usar estado e atualizar quando receber empresa via query/localStorage
  const [empresa_id_state, setEmpresaIdState] = useState<number | null>(() => {
    const id = getEmpresaId();
    return id && id > 0 ? id : null;
  });

  // Atualizar quando o hook global detectar mudança via query (ex.: ?empresa=)
  useReceiveEmpresaFromQuery(() => {
    const newId = getEmpresaId();
    if (newId && newId !== empresa_id_state) {
      setEmpresaIdState(newId);
    }
  });

  // Garantir estado inicial caso o localStorage seja populado após montagem
  useEffect(() => {
    const current = getEmpresaId();
    if (current && current > 0 && current !== empresa_id_state) {
      setEmpresaIdState(current);
    }
  }, []);

  const empresa_id = empresa_id_state;
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = useMemo(() => {
    const raw = Array.isArray(params.slug) ? params.slug.at(-1) : params.slug;
    return (raw ?? "").trim().toLowerCase();
  }, [params.slug]);

  // ⬇️ usa o endpoint novo
  const categoriaQuery = useCategoriaPorSlug(empresa_id, slugAtual);
  const { data, isLoading, isPending } = categoriaQuery;
  // Caso a empresa ainda não estivesse disponível no primeiro render, forçar refetch
  // quando `empresa_id` ou `slugAtual` ficarem disponíveis/alterarem.
  useEffect(() => {
    if (!empresa_id || !slugAtual) return;
    // Se ainda não tem dados, ou quer garantir atualidade, refetch
    if (!data) {
      categoriaQuery.refetch().catch(() => {
        /* ignore fetch errors here — UI já trata caso de ausência de dados */
      });
    }
  }, [empresa_id, slugAtual]);
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
 
  const [searchResults, setSearchResults] = React.useState<{
    produtos: ProdutoEmpMini[];
    receitas: ReceitaMiniDTO[];
    combos: ComboMiniDTO[];
    total?: number;
    quantidade_produtos?: number;
  } | null>(null);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);
 
  // Quando há termo de busca (q), chamar o endpoint público de busca e renderizar resultados
  React.useEffect(() => {
    const termo = (q ?? "").trim();
    if (!termo || !empresa_id) {
      setSearchResults(null);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    let mounted = true;
    const doSearch = async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);
        const params = {
          empresa_id: empresa_id,
          termo,
          apenas_disponiveis: true,
          apenas_ativos: true,
          limit: 50,
          page: 1,
        };

        const { data: resp } = await api.get("/api/catalogo/public/busca/global", { params });

        if (!mounted) return;

        const produtosApi = Array.isArray(resp?.produtos) ? resp.produtos : [];
        const produtos: ProdutoEmpMini[] = produtosApi.map((p: any) => {
          const descricao = p.nome ?? p.descricao ?? "";
          const imagem = p.imagem ?? null;
          const preco_venda = Number(p.preco_venda ?? p.preco ?? 0) || 0;
          return {
            empresa_id: p.empresa_id ?? p.empresa ?? empresa_id,
            cod_barras: String(p.cod_barras ?? p.id ?? ""),
            preco_venda,
            produto: {
              id: undefined,
              descricao,
              imagem,
              cod_categoria: null,
            },
            subcategoria_id: undefined,
          };
        });

        const receitasApi = Array.isArray(resp?.receitas) ? resp.receitas : [];
        const receitas: ReceitaMiniDTO[] = receitasApi.map((r: any) => ({
          id: Number(r.id ?? r.receita_id ?? 0) || 0,
          empresa_id: r.empresa_id ?? empresa_id,
          nome: r.nome ?? r.descricao ?? "",
          descricao: r.descricao ?? "",
          preco_venda: Number(r.preco_venda ?? r.preco ?? 0) || 0,
          imagem: r.imagem ?? null,
          vitrine_id: null,
          disponivel: Boolean(r.disponivel ?? true),
          ativo: Boolean(r.ativo ?? true),
        }));

        const combosApi = Array.isArray(resp?.combos) ? resp.combos : [];
        const combos: ComboMiniDTO[] = combosApi.map((c: any) => ({
          id: Number(c.id ?? c.combo_id ?? 0) || 0,
          empresa_id: c.empresa_id ?? empresa_id,
          titulo: c.titulo ?? c.nome ?? "",
          descricao: c.descricao ?? "",
          preco_total: Number(c.preco_total ?? c.preco ?? 0) || 0,
          imagem: c.imagem ?? null,
          ativo: Boolean(c.ativo ?? true),
          vitrine_id: null,
        }));

        setSearchResults({
          produtos,
          receitas,
          combos,
          total: resp?.total,
          quantidade_produtos: resp?.quantidade_produtos,
        });
      } catch (err: any) {
        console.error("Erro na busca pública (categoria):", err);
        if (!mounted) return;
        setSearchError("Erro ao buscar resultados");
        setSearchResults(null);
      } finally {
        if (!mounted) return;
        setSearchLoading(false);
      }
    };

    doSearch().catch((err) => {
      console.error("Erro inesperado na busca pública (categoria):", err);
      const status = err?.response?.status;
      if (status === 404) {
        setSearchResults({ produtos: [], receitas: [], combos: [], total: 0, quantidade_produtos: 0 });
        setSearchError(null);
      } else {
        setSearchError("Erro ao buscar resultados");
        setSearchResults(null);
      }
      setSearchLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [q, empresa_id]);
 
  const buildHrefCategoria = useCallback(
    (rawHref?: string | null | undefined) => {
      if (!rawHref || typeof rawHref !== "string") return undefined;
      // remover prefixo /cardapio se presente
      const href = rawHref.startsWith("/cardapio") ? rawHref.replace(/^\/cardapio/, "") : rawHref;
      // se não for rota de categoria, retornar como veio
      if (!href.startsWith("/categoria")) return href;
      const parts = href.split("/").filter(Boolean); // ["categoria", "maybeParent", "child"]
      const afterCategoria = parts.slice(1); // ["maybeParent", "child"]
      if (afterCategoria.length === 0) return "/categoria";
      // se já tem mais de um segmento, último é o slug desejado
      const childSlug = afterCategoria[afterCategoria.length - 1];
      // se estamos em uma categoria pai (slugAtual) e diferente do childSlug,
      // construir /categoria/{slugAtual}/{childSlug}
      if (slugAtual) {
        // se href já contém o slugAtual como primeiro segmento depois de /categoria, manter href
        if (afterCategoria[0] === slugAtual) {
          return `/categoria/${afterCategoria.join("/")}`;
        }
        return `/categoria/${slugAtual}/${childSlug}`;
      }
      // fallback: retornar href original (sem /cardapio)
      return `/categoria/${afterCategoria.join("/")}`;
    },
    [slugAtual]
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

        {/* Se existe termo de busca, mostrar resultados da busca global (mesma lógica da Home) */}
        {q.trim() ? (
          <div>
            <div className="mb-2 px-2">
              <h2 className="text-sm font-semibold">Resultados para: "{q}"</h2>
            </div>

            {searchLoading && <p className="px-2 text-sm text-muted-foreground">Buscando...</p>}
            {searchError && <p className="px-2 text-sm text-destructive">{searchError}</p>}

            {searchResults?.produtos && searchResults.produtos.length > 0 && (
              <section className="px-2">
                <h3 className="text-xs font-medium mb-2">Produtos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {searchResults.produtos.map((p) => (
                    <div key={p.cod_barras} className="flex justify-center">
                      <ProductCard produto={p} onOpenSheet={() => { setProdutoSelecionado(p); setSheetOpen(true); }} empresa_id={empresa_id!} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {searchResults?.receitas && searchResults.receitas.length > 0 && (
              <section className="px-2 mt-4">
                <h3 className="text-xs font-medium mb-2">Receitas</h3>
                <div className="grid grid-cols-3 gap-3">
                  {searchResults.receitas.map((r) => (
                    <div key={r.id} className="flex justify-center">
                      <ReceitaCard receita={r} onSelectReceita={(rv) => { /* TODO: abrir sheet de receita */ }} empresa_id={empresa_id!} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {searchResults?.combos && searchResults.combos.length > 0 && (
              <section className="px-2 mt-4">
                <h3 className="text-xs font-medium mb-2">Combos</h3>
                <div className="grid grid-cols-3 gap-3">
                  {searchResults.combos.map((c) => (
                    <div key={c.id} className="flex justify-center">
                      <ComboCard combo={c} onSelectCombo={(cv) => { /* TODO: abrir sheet de combo */ }} empresa_id={empresa_id!} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <>
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
                hrefCategoria={buildHrefCategoria(vitrine.href_categoria)}
                hideVerTudo={true}
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
                hrefCategoria={buildHrefCategoria(vit.href_categoria)}
                isHome={false}
                vitrineIsHome={vit.is_home}
                isHighlighted={highlightedVitrineId === vit.id}
                isLast={index === vitrinesFilhoFiltradas.length - 1}
              />
            ))}
          </>
        )}


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
