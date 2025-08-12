"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/VitrineOptions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { ProductCard } from "./ProductCard";
import { CardVerMais } from "../CardVerMais";

interface Props {
  vitrineId: number;
  titulo: string;
  produtos: ProdutoEmpMini[];
  codCategoria: number;
  empresaId: number;
  onOpenSheet?: (p: ProdutoEmpMini) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
  hrefCategoria?: string;
  isHome?: boolean;         // se está renderizando em contexto de home
  vitrineIsHome?: boolean;  // estado real vindo do backend/categoria
}

export default function ProductsVitrineSection({
  vitrineId,
  titulo,
  produtos,
  codCategoria,
  empresaId,
  onOpenSheet,
  sectionRef,
  hrefCategoria,
  isHome,
  vitrineIsHome
}: Props) {
  // ---- NOVO: só renderiza se isHome === vitrineIsHome ----
  if (typeof vitrineIsHome === "boolean" && vitrineIsHome !== isHome) {
    return null;
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 1;
    setHasOverflow(overflow);
    setCanScrollLeft(overflow && el.scrollLeft > 0);
    setCanScrollRight(overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);

    checkScroll();

    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, produtos.length]);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.scrollLeft + offset;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(Math.max(0, target), max), behavior: "smooth" });
  };

  return (
    <section
      id={`secao-${vitrineId}`}
      ref={sectionRef}
      className="relative p-4 bg-muted rounded-xl scroll-mt-20"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{titulo}</h2>
        <AdminSecaoSubCategOptions
          vitrineId={vitrineId}
          empresaId={empresaId}
          codCategoria={codCategoria}
        />
      </div>

      <div className="relative">
        {hasOverflow && canScrollLeft && (
          <button
            onClick={() => scrollBy(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/70 text-background shadow p-1 rounded-full"
          >
            <ChevronLeft />
          </button>
        )}
        {hasOverflow && canScrollRight && (
          <button
            onClick={() => scrollBy(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary/70 text-background shadow p-1 rounded-full"
          >
            <ChevronRight />
          </button>
        )}

        <div className="relative">
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
            {produtos.map((produto) => (
              <div key={produto.cod_barras} className="shrink-0 w-[120px]">
                <ProductCard
                  produto={produto}
                  onOpenSheet={() => onOpenSheet?.(produto)} 
                  empresa_id={empresaId}
                  isHome={isHome}
                  />
              </div>
            ))}

            {isHome && hrefCategoria && (
              <CardVerMais href={hrefCategoria} />
            )}

            <CardAddProduto
              vitrineId={vitrineId}
              codCategoria={codCategoria}
              empresaId={empresaId}
              is_home={isHome}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
