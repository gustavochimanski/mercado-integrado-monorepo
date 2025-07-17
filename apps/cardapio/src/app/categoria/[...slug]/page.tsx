"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCardapio } from "@cardapio/hooks/useCategoriasDelivery";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "@cardapio/components/Shared/ui/button";
import CategoryScrollSection from "@cardapio/components/Shared/Category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/Sheet/SheetAddProduto";
import { CircleArrowLeft } from "lucide-react";
import CardAddSecaoSubCateg from "@cardapio/components/admin/card/CardAddSecaoSubCateg";
import ProductsSection from "@cardapio/components/Shared/Category/ProductsSection";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);

  const router = useRouter();
  const empresaId = 1;
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = Array.isArray(params.slug)
    ? params.slug[params.slug.length - 1]
    : params.slug ?? "";

  const { data: categorias = [], isLoading } = useCardapio(empresaId);

  // ─── MEMOIZAÇÕES ───────────────────────────────────────────────────────────────
  const categoriaAtual = useMemo(
    () => categorias.find((cat) => cat.slug === slugAtual),
    [categorias, slugAtual]
  );
  const subcategorias = useMemo(
    () => categorias.filter((cat) => cat.slug_pai === slugAtual),
    [categorias, slugAtual]
  );
  const vitrines = useMemo(() => categoriaAtual?.vitrines ?? [], [categoriaAtual]);
  const produtosDeTodasCategorias = useMemo(
    () => categorias.flatMap((cat) => cat.produtos),
    [categorias]
  );

  // ─── CALLBACKS ────────────────────────────────────────────────────────────────
  const handleOpenSheet = useCallback((produto: ProdutoEmpMini) => {
    setProdutoSelecionado(produto);
    setSheetOpen(true);
  }, []);
  const handleAdd = useCallback((produto: ProdutoEmpMini, quantity: number) => {
    alert(`Adicionado: ${produto.produto.descricao} x${quantity}`);
    setSheetOpen(false);
  }, []);

  // ─── OBSERVER DE SEÇÃO ATIVA ───────────────────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const sorted = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (sorted.length > 0) {
          const id = sorted[0].target.id;
          setSecaoAtiva(id);
          const btn = document.querySelector(`[data-scroll-button='${id}']`);
          if (btn) (btn as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0.25 }
    );

    const sections = document.querySelectorAll("[id^='secao-']");
    sections.forEach((s) => observer.observe(s));

    return () => {
      observer.disconnect();
    };
  }, [vitrines]);

  // ─── RENDER DAS VITRINES ───────────────────────────────────────────────────────
  const renderVitrines = useCallback(() => {
    return vitrines.map((vitrine, idx) => {
      const produtosFiltrados = produtosDeTodasCategorias.filter(
        (p) => p.produto.cod_categoria === vitrine.cod_categoria && p.subcategoria_id === vitrine.id
      );
      const bgClass = idx % 2 === 0 ? "bg-muted" : "bg-background";

      return (
        <ProductsSection
          key={vitrine.id}
          categoriaLabel={vitrine.titulo}
          produtos={produtosFiltrados}
          onAdd={handleOpenSheet}
          subcategoriaId={vitrine.id}
          codCategoria={vitrine.cod_categoria}
          value={vitrine.id.toString()}
          bgClass={bgClass}
        />
      );
    });
  }, [vitrines, produtosDeTodasCategorias, handleOpenSheet]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg">Carregando categoria e produtos…</span>
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
          <CategoryScrollSection
            categorias={subcategorias}
            titulo={categoriaAtual.descricao}
            parentSlug={categoriaAtual.slug}
            empresaId={empresaId}
          />
        )}

        {vitrines.length > 0 && (
          <div className="overflow-x-auto whitespace-nowrap hide-scrollbar sticky top-0 z-50 bg-background shadow-sm py-2 px-2 h-14">
            <div className="flex gap-2">
              {vitrines.map((vitrine) => (
                <Button
                  key={vitrine.id}
                  variant="ghost"
                  data-scroll-button={`secao-${vitrine.id}`}
                  onClick={() => {
                    const target = document.getElementById(`secao-${vitrine.id}`);
                    target?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition
                    ${secaoAtiva === `secao-${vitrine.id}` ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"}`}
                >
                  {vitrine.titulo}
                </Button>
              ))}
            </div>
          </div>
        )}

        {renderVitrines()}

        {categoriaAtual && <CardAddSecaoSubCateg empresaId={empresaId} codCategoria={categoriaAtual.id} />}
      </main>

      {produtoSelecionado && (
        <SheetAdicionarProduto produto={produtoSelecionado} isOpen={sheetOpen} onAdd={handleAdd} onClose={() => setSheetOpen(false)} />
      )}
    </div>
  );
}
