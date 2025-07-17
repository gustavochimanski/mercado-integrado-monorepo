"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProdutoEmpMini } from "../../../types/Produtos";

import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/SecaoSubCategOptions";
import { ProductCard } from "../card/ProductCard";

import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@cardapio/components/Shared/ui/accordion";
import { Button } from "../ui/button";

interface Props {
  categoriaLabel?: string;
  produtos: ProdutoEmpMini[];
  onAdd?: (p: ProdutoEmpMini) => void;
  subcategoriaId: number;
  codCategoria: number;
  value: string;
  bgClass: string;
  modoAccordion?: boolean;
}

export default function ProductsSection({
  categoriaLabel,
  produtos,
  onAdd,
  subcategoriaId,
  codCategoria,
  value,
  bgClass,
  modoAccordion = true,
}: Props) {
  // referências e estados
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef   = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft]   = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // atualiza flags de scroll
  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  // 1) monta listeners de scroll/resize no container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // já calcula na montagem (ou quando produtos mudarem)
    updateScrollButtons();

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [produtos]);

  // 2) MutationObserver para detectar quando o AccordionContent abre
  useEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) return;

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (
          m.type === "attributes" &&
          contentEl.getAttribute("data-state") === "open"
        ) {
          // delay curto pra o conteúdo renderizar/animar
          setTimeout(updateScrollButtons, 100);
        }
      }
    });

    observer.observe(contentEl, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // scroll suave
  const scrollBy = (distance: number) => {
    containerRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  // JSX compartilhado: container + setas
  const ScrollContainer = (
    <div className="relative w-full">
      <div
        id={`scroll-${value}`}
        ref={containerRef}
        className="flex overflow-x-auto items-stretch gap-2 hide-scrollbar px-2 pb-4 scroll-smooth"
      >
        {produtos.map((p) => (
          <div key={p.cod_barras} className="snap-start flex flex-col h-full">
            <ProductCard produto={p} onAdd={() => onAdd?.(p)} />
          </div>
        ))}
        <CardAddProduto
          empresaId={1}
          codCategoria={codCategoria}
          subcategoriaId={subcategoriaId}
        />
      </div>

      {canScrollLeft && (
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background border border-border rounded-full shadow p-1 hover:bg-muted transition"
          onClick={() => scrollBy(-200)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background border border-border rounded-full shadow p-1 hover:bg-muted transition"
          onClick={() => scrollBy(200)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );

  // versão com Accordion
  if (modoAccordion) {
    return (
      <AccordionItem value={value} className={bgClass} id={`secao-${subcategoriaId}`}>
        <AccordionTrigger
          className="text-xl font-bold"
          rightElement={
            produtos[0]?.produto.imagem && (
              <div className="p-1 bg-white rounded-full">
                <img
                  src={produtos[0].produto.imagem}
                  alt={produtos[0].produto.descricao}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            )
          }
        >
          <div className="flex">
            {categoriaLabel}
            <AdminSecaoSubCategOptions
              empresaId={1}
              codCategoria={codCategoria}
              subcategoriaId={subcategoriaId}
            />
          </div>
        </AccordionTrigger>

        <AccordionContent ref={contentRef}>
          {ScrollContainer}
        </AccordionContent>
      </AccordionItem>
    );
  }

  // versão plana sem Accordion
  return (
    <div className={bgClass} id={`secao-${subcategoriaId}`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex">
          {categoriaLabel}
          <AdminSecaoSubCategOptions
            empresaId={1}
            codCategoria={codCategoria}
            subcategoriaId={subcategoriaId}
          />
        </div>
        {produtos[0]?.produto.imagem && (
          <div className="p-1 bg-white rounded-full">
            <img
              src={produtos[0].produto.imagem}
              alt={produtos[0].produto.descricao}
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
      </div>

      {ScrollContainer}
    </div>
  );
}
