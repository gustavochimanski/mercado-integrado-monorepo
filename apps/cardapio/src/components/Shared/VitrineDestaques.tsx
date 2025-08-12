"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "./ui/button";
import { ProductCard } from "./product/ProductCard";
import { Card } from "./ui/card";
import { CardAddProduto } from "../admin/card/CardAddProduto";

type Props = {
  produtos: ProdutoEmpMini[];
  titulo?: string;
  verMaisHref?: string;
  onSelectProduto?: (produto: ProdutoEmpMini) => void;
  // novos
  empresaId: number;
  codCategoria: number;
  vitrineId: number;
  is_home?: boolean;
};

export default function VitrineDestaques({
  produtos,
  titulo = "Destaques",
  verMaisHref = "/vitrine",
  onSelectProduto,
  empresaId,
  codCategoria,
  vitrineId,
  is_home = true,
}: Props) {
  if (!produtos || produtos.length === 0) return null;

  const lista = produtos.slice(0, 3);

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-semibold">{titulo}</h2>
        <Link href={verMaisHref} className="text-sm text-primary hover:underline">
          Ver tudo
        </Link>
      </div>

      {/* Linha rolável no mobile */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar scroll-smooth px-2">
        {lista.map((p) => (
          <ProductCard
            key={p.cod_barras}
            produto={p}
            onOpenSheet={() => onSelectProduto?.(p)}
            onEdit={() => console.log("editar", p.cod_barras)}
            isHome={true}
          />
        ))}


        {/* Card "Ver mais" no final */}
        <Link
          href={verMaisHref}
          className="min-w-[100px] max-w-[100px] h-[200px] sm:w-full sm:max-w-none"
        >
          <Card className="w-[100px] h-[200px] sm:w-full flex flex-col items-center justify-center gap-2 cursor-pointer">
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Ver mais</span>
              <ChevronRight className="w-5 h-5 mt-1" />
            </div>
            <Button size="sm" variant="secondary">Explorar</Button>
          </Card>
        </Link>
        
        {/* Card "Adicionar Produto" (só para admin) */}
        <CardAddProduto
          empresaId={empresaId}
          codCategoria={codCategoria}
          vitrineId={vitrineId}
          is_home={is_home}
        />
      </div>
    </section>
  );
}
