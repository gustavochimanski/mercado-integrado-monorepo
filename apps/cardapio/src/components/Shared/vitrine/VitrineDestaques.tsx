"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

  const handleNoLinkClick = () =>
    toast("Esta vitrine não está vinculada a uma categoria.");

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold mx-2">{titulo}</h2>

        <AdminVitrineOptions
          empresaId={empresaId}
          codCategoria={codCategoria}
          vitrineId={vitrineId}
          isHome={is_home}
        />

        {hasHref ? (
          <Link
            href={verMaisHref}
            className="inline-flex items-center px-3 py-0.5 rounded-full text-xs text-primary font-semibold bg-primary/20"
          >
            Ver tudo
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleNoLinkClick}
            className="inline-flex items-center px-3 py-0.5 rounded-full text-xs text-primary font-semibold bg-primary/20"
            aria-disabled
          >
            Ver tudo
          </button>
        )}
      </div>

      {/* Linha rolável no mobile */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth px-2">
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

        {/* Card "Ver mais" no final */}
        {hasHref ? (
          <Link href={verMaisHref} className="sm:w-full sm:max-w-none">
            <Card className="w-[90px] h-[180px] sm:w-full flex flex-col items-center justify-center gap-2 cursor-pointer">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Ver mais</span>
                <ChevronRight className="w-5 h-5 mt-1" />
              </div>
              <Button size="sm" variant="secondary">
                Explorar
              </Button>
            </Card>
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleNoLinkClick}
            className="sm:w-full sm:max-w-none"
            aria-disabled
          >
            <Card className="w-[90px] h-[180px] sm:w-full flex flex-col items-center justify-center gap-2 cursor-not-allowed">
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Ver mais</span>
                <ChevronRight className="w-5 h-5 mt-1" />
              </div>
              <Button size="sm" variant="secondary">Explorar</Button>
            </Card>
          </button>
        )}
      </div>
    </section>
  );
}
