"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProdutoEmpMini } from "../../../types/Produtos";

import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/SecaoSubCategOptions";
import { ProductCard } from "../card/ProductCard";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
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
  // 1) Ref e estados para controlar setas
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 2) Função que atualiza flags de scroll
  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // atualiza na montagem
    updateScrollButtons();
    // escuta scroll e resize
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [produtos]); // re-analisar se a lista mudar

  // Handler de scroll
  const scrollBy = (distance: number) => {
    containerRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  // JSX compartilhado para o container de produtos + setas
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

      {/*
        3) Setas condicionais:
        - Esquerda se canScrollLeft
        - Direita se canScrollRight
      */}
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

  if (modoAccordion) {
    return (
      <AccordionItem value={value} className={`${bgClass}`}>
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

        <AccordionContent>
          {ScrollContainer}
        </AccordionContent>
      </AccordionItem>
    );
  }

  // versão plana sem Accordion
  return (
    <div className={`${bgClass}`}>
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
