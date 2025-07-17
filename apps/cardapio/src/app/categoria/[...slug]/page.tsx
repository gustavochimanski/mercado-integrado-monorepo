"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCategoriasDelivery } from "@cardapio/hooks/useCategoriasDelivery";
import type { ProdutoEmpMini } from "@cardapio/types/Produtos";

import { Accordion } from "@cardapio/components/Shared/ui/accordion";
import { Button } from "@cardapio/components/Shared/ui/button";
import HeaderComponent from "@cardapio/components/Shared/Header";
import CategoryScrollSection from "@cardapio/components/Shared/Category/categoryScrollSection";
import { SheetAdicionarProduto } from "@cardapio/components/Shared/Sheet/SheetAddProduto";
import { CircleArrowLeft } from "lucide-react";
import CardAddSecaoSubCateg from "@cardapio/components/admin/card/CardAddSecaoSubCateg";
import ProductsSection from "@cardapio/components/Shared/Category/ProductsSection";

export default function RouteCategoryPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEmpMini | null>(null);
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const sorted = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (sorted.length > 0) {
          const id = sorted[0].target.id;
          setSecaoAtiva(id);

          const button = document.querySelector(`[data-scroll-button='${id}']`);
          if (button) {
            button.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px", // foco no meio da tela
        threshold: 0.25,
      }
    );

    const sections = document.querySelectorAll("[id^='secao-']");
    sections.forEach((secao) => observer.observe(secao));

    return () => {
      sections.forEach((secao) => observer.unobserve(secao));
    };
  }, []);



  const router = useRouter();
  const empresaId = 1;
  
  const params = useParams<{ slug?: string | string[] }>();
  const slugAtual = Array.isArray(params.slug)
  ? params.slug[params.slug.length - 1]
  : params.slug ?? "";
  
  const { data: categorias = [], isLoading } = useCategoriasDelivery(empresaId);

  const categoriaAtual = categorias.find((cat) => cat.slug === slugAtual);
  const subcategorias = categorias.filter((cat) => cat.slug_pai === slugAtual);
  const vitrines = categoriaAtual?.vitrines ?? [];

  const produtosDeTodasCategorias = categorias.flatMap((cat) => cat.produtos);

  function handleOpenSheet(produto: ProdutoEmpMini) {
    setProdutoSelecionado(produto);
    setSheetOpen(true);
  }

  function handleAdd(produto: ProdutoEmpMini, quantity: number) {
    alert(`Adicionado: ${produto.produto.descricao} x${quantity}`);
    setSheetOpen(false);
  }

  function renderVitrines(modoAccordion: boolean) {
    return vitrines.map((vitrine, index) => {
      const produtosFiltrados = produtosDeTodasCategorias.filter((produto) => {
        const mesmaCategoria = produto.produto.cod_categoria === vitrine.cod_categoria;
        const mesmaSubcategoria = produto.subcategoria_id === vitrine.id;
        return mesmaCategoria && mesmaSubcategoria;
      });

      const bgClass = index % 2 === 0 ? "bg-muted" : "bg-background";

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
          modoAccordion={modoAccordion}
        />
      );
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg">Carregando categoria e produtos…</span>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex flex-col gap-4">
      {/* <HeaderComponent /> */}

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

        {/* 🧭 Atalhos de seções */}
        {vitrines.length > 0 && (
          <div className="overflow-x-auto whitespace-nowrap hide-scrollbar sticky top-0 z-50 bg-background shadow-sm py-2 px-2 h-22">
            <div className="flex gap-2">
              {vitrines.map((vitrine) => (
                <Button
                  variant={"ghost"}
                  key={vitrine.id}
                  data-scroll-button={`secao-${vitrine.id}`}
                  onClick={() => {
                    const target = document.getElementById(`secao-${vitrine.id}`);
                    target?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`px-4 py-1 text-sm font-medium rounded-full transition
                    ${secaoAtiva === `secao-${vitrine.id}` 
                      ? "bg-primary text-white" 
                      : "bg-muted hover:bg-muted/80"}
                  `}
                >
                  {vitrine.titulo}
                </Button>

              ))}
            </div>
          </div>
        )}

        {vitrines.length > 10 ? (
          <Accordion type="single" collapsible className="w-full">
            {renderVitrines(true)}
          </Accordion>
        ) : (
          renderVitrines(false)
        )}

        {categoriaAtual && (
          <CardAddSecaoSubCateg empresaId={empresaId} codCategoria={categoriaAtual.id} />
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
