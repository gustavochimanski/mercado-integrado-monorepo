// components/Shared/section/ProductsVitrineSection.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { ProdutoEmpMini } from "../../../types/Produtos";
import { ProductCard } from "../card/ProductCard";
import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/SecaoSubCategOptions";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  vitrineId: number;
  titulo: string;
  produtos: ProdutoEmpMini[];
  codCategoria: number;
  empresaId: number;
}

export default function ProductsVitrineSection({
  vitrineId,
  titulo,
  produtos,
  codCategoria,
  empresaId,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, []);

    const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const targetScroll = el.scrollLeft + offset;
    const maxScroll = el.scrollWidth - el.clientWidth;

    el.scrollTo({
        left: Math.min(Math.max(0, targetScroll), maxScroll),
        behavior: "smooth",
    });
    };


  return (
    <section
      id={`secao-${vitrineId}`}
      className={`relative p-4 bg-muted rounded-xl scroll-mt-16`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{titulo}</h2>
        <AdminSecaoSubCategOptions
          subcategoriaId={vitrineId}
          empresaId={empresaId}
          codCategoria={codCategoria}
        />
      </div>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-300)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary/70 text-background shadow p-1 rounded-full"
          >
            <ChevronLeft />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scrollBy(300)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary/70 text-background shadow p-1 rounded-full"
          >
            <ChevronRight />
          </button>
        )}

        <div className="relative">
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth "
            >
                {produtos.map((produto) => (
                <div key={produto.cod_barras} className="shrink-0 w-[120px]">
                    <ProductCard produto={produto} />
                </div>
                ))}
                <CardAddProduto
                    subcategoriaId={vitrineId}
                    codCategoria={codCategoria}
                    empresaId={empresaId}
                />
            </div>

        </div>
      </div>
    </section>
  );
}
