"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import throttle from "lodash.throttle";
import { ProdutoEmpMini } from "../../../types/Produtos";
import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/SecaoSubCategOptions";
import { ProductCard } from "../card/ProductCard";

interface Props {
  categoriaLabel?: string;
  produtos: ProdutoEmpMini[];
  onAdd?: (p: ProdutoEmpMini) => void;
  subcategoriaId: number;
  codCategoria: number;
  value: string;
  bgClass: string;
}

export default function ProductsSection({
  categoriaLabel,
  produtos,
  onAdd,
  subcategoriaId,
  codCategoria,
  value,
  bgClass,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // throttle + useCallback para o mesmo handler sempre
  const updateScrollButtons = useCallback(
    throttle(() => {
      const el = containerRef.current;
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }, 200),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);
    // inicializa
    updateScrollButtons();
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      updateScrollButtons.cancel();
    };
  }, [updateScrollButtons]);

  return (
    <div className={bgClass} id={`secao-${subcategoriaId}`}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span>{categoriaLabel}</span>
          <AdminSecaoSubCategOptions empresaId={1} codCategoria={codCategoria} subcategoriaId={subcategoriaId} />
        </div>
        {produtos[0]?.produto.imagem && (
          <img
            src={produtos[0].produto.imagem}
            alt={produtos[0].produto.descricao}
            loading="lazy"
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        )}
      </div>

      <div className="relative w-full">
        <div ref={containerRef} className="flex overflow-x-auto gap-2 hide-scrollbar px-2 pb-4 scroll-smooth">
          {produtos.map((p) => (
            <div key={p.cod_barras} className="snap-start flex flex-col">
              <ProductCard produto={p} onAdd={() => onAdd?.(p)} />
            </div>
          ))}
          <CardAddProduto empresaId={1} codCategoria={codCategoria} subcategoriaId={subcategoriaId} />
        </div>

        {canScrollLeft && (
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full shadow bg-background border"
            onClick={() => containerRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
          >
            ←
          </button>
        )}
        {canScrollRight && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full shadow bg-background border"
            onClick={() => containerRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
          >
            →
          </button>
        )}
      </div>
    </div>
  );
}
