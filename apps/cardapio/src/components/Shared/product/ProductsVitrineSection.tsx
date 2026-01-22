"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { CardAddProduto } from "@cardapio/components/admin/card/CardAddProduto";
import AdminSecaoSubCategOptions from "@cardapio/components/admin/options/VitrineOptions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { ProductCard } from "./ProductCard";
import { ComboCard } from "./ComboCard";
import { ReceitaCard } from "./ReceitaCard";
import { CardVerMais } from "../CardVerMais";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ComboMiniDTO, ReceitaMiniDTO } from "@cardapio/services/home";

interface Props {
  vitrineId: number;
  titulo: string;
  produtos: ProdutoEmpMini[];
  combos?: ComboMiniDTO[] | null;
  receitas?: ReceitaMiniDTO[] | null;
  codCategoria: number | null;
  empresaId: number;
  onOpenSheet?: (p: ProdutoEmpMini) => void;
  onSelectCombo?: (combo: ComboMiniDTO) => void;
  onSelectReceita?: (receita: ReceitaMiniDTO) => void;
  sectionRef?: (el: HTMLDivElement | null) => void;
  hrefCategoria?: string;
  isHome?: boolean;         // se está renderizando em contexto de home
  vitrineIsHome?: boolean;  // estado real vindo do backend/categoria
  isHighlighted?: boolean;  // se a vitrine deve ter destaque visual (background)
}

export default function ProductsVitrineSection({
  vitrineId,
  titulo,
  produtos,
  combos,
  receitas,
  codCategoria,
  empresaId,
  onOpenSheet,
  onSelectCombo,
  onSelectReceita,
  sectionRef,
  hrefCategoria,
  isHome,
  vitrineIsHome,
  isHighlighted = false
}: Props) {
  // A filtragem por is_home é feita nos componentes pai (ProductsSection ou página de categoria)
  // Este componente apenas renderiza a vitrine quando é chamado
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  
  // Calcular total de itens para scroll
  const totalItems = produtos.length + (combos?.length ?? 0) + (receitas?.length ?? 0);

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
  }, [checkScroll, totalItems]);

  const scrollBy = (offset: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.scrollLeft + offset;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(Math.max(0, target), max), behavior: "smooth" });
  };

  const { isAdmin } = useUserContext()

  return (
    <section
      id={`secao-${vitrineId}`}
      ref={sectionRef}
      className={`relative pt-2 px-2 pb-2 bg-muted rounded-xl scroll-mt-32 overflow-hidden transition-all duration-500 ${
        isHighlighted ? 'bg-primary/10 ring-2 ring-primary/20 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">{titulo}</h2>
        {codCategoria !== null && (
          <AdminSecaoSubCategOptions
            vitrineId={vitrineId}
            empresaId={empresaId}
            codCategoria={codCategoria}
          />
        )}
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
          <div ref={scrollRef} className={`flex overflow-x-auto -mr-2 ${isAdmin ? "": "hide-scrollbar"} `}>
            {/* Renderizar produtos */}
            {produtos.map((produto) => (
              <div key={produto.cod_barras} className="shrink-0 w-[120px] h-[180px] mr-2">
                <ProductCard
                  produto={produto}
                  onOpenSheet={() => onOpenSheet?.(produto)} 
                  empresa_id={empresaId}
                  vitrineId={vitrineId}
                />
              </div>
            ))}

            {/* Renderizar combos */}
            {combos?.map((combo) => (
              <div key={`combo-${combo.id}`} className="shrink-0 w-[120px] h-[180px] mr-2">
                <ComboCard
                  combo={combo}
                  onSelectCombo={onSelectCombo}
                  empresa_id={empresaId}
                  vitrineId={vitrineId}
                />
              </div>
            ))}

            {/* Renderizar receitas */}
            {receitas?.map((receita) => (
              <div key={`receita-${receita.id}`} className="shrink-0 w-[120px] h-[180px] mr-2">
                <ReceitaCard
                  receita={receita}
                  onSelectReceita={onSelectReceita}
                  empresa_id={empresaId}
                  vitrineId={vitrineId}
                />
              </div>
            ))}

            {isHome && hrefCategoria && (
              <div className="shrink-0 w-[140px] h-[200px] mr-2">
                <CardVerMais href={hrefCategoria} />
              </div>
            )}

            <div className="shrink-0 w-[140px] h-[200px]">
              <CardAddProduto
                vitrineId={vitrineId}
                empresaId={empresaId}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
