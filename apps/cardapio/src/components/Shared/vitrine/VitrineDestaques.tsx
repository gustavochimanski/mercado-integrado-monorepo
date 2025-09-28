"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "../ui/button";
import { ProductCard } from "../product/ProductCard";
import { Card } from "../ui/card";
import { CardAddProduto } from "../../admin/card/CardAddProduto";
import AdminVitrineOptions from "@cardapio/components/admin/options/VitrineOptions";
import { toast } from "sonner";

type Props = {
  produtos: ProdutoEmpMini[];
  titulo?: string;
  /** Se for undefined -> usa default "/vitrine".
   *  Se for null -> NÃO renderiza Link (mostra toast ao clicar). */
  verMaisHref?: string | null;
  onSelectProduto?: (produto: ProdutoEmpMini) => void;

  // novos
  empresaId: number;
  codCategoria: number;      // se em alguns casos não existir, mude para number | null
  vitrineId: number;
  is_home?: boolean;
};

const isValidHref = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

export default function VitrineDestaques({
  produtos,
  titulo = "Destaques",
  verMaisHref = "/vitrine", // default só pega quando é undefined (não quando é null)
  onSelectProduto,
  empresaId,
  codCategoria,
  vitrineId,
  is_home = true,
}: Props) {
  const lista = produtos.slice(0, 4);
  const hasHref = isValidHref(verMaisHref);

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

    checkScroll();
    el.addEventListener("scroll", checkScroll);

    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);

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

  const handleNoLinkClick = () =>
    toast("Esta vitrine não está vinculada a uma categoria.");

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-lg font-semibold text-gray-800">{titulo}</h2>

        <AdminVitrineOptions
          empresaId={empresaId}
          codCategoria={codCategoria}
          vitrineId={vitrineId}
          isHome={is_home}
        />

        {hasHref ? (
          <Link
            href={verMaisHref}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-primary font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            Ver tudo
            <ChevronRight className="w-3 h-3" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleNoLinkClick}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-primary font-medium bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-disabled
          >
            Ver tudo
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Linha rolável com setas de navegação */}
      <div className="relative">
        {hasOverflow && canScrollLeft && (
          <button
            onClick={() => scrollBy(-300)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-primary/80 text-background shadow-lg p-2 rounded-full hover:bg-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {hasOverflow && canScrollRight && (
          <button
            onClick={() => scrollBy(300)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-primary/80 text-background shadow-lg p-2 rounded-full hover:bg-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div ref={scrollRef} className={`flex gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-4 pb-2 items-start ${!hasOverflow ? 'justify-evenly' : 'justify-start'}`}>
          {lista.map((p) => (
            <ProductCard
              key={p.cod_barras}
              produto={p}
              onOpenSheet={() => onSelectProduto?.(p)}
              onEdit={() => console.log("editar", p.cod_barras)}
              vitrineId={vitrineId}
            />
          ))}

          {/* Card "Adicionar Produto" (só para admin) */}
          <CardAddProduto empresaId={empresaId} vitrineId={vitrineId}  />
        </div>
      </div>
    </section>
  );
}
