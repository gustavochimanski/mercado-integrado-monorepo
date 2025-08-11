"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { Button } from "./ui/button";
import { ProductCard } from "./product/ProductCard";
import { Card } from "./ui/card";

type Props = {
  produtos?: ProdutoEmpMini[];
  titulo?: string;
  verMaisHref?: string;
  onSelectProduto?: (produto: ProdutoEmpMini) => void;
};

// ✅ Mock interno
const MOCK_PRODUTOS: ProdutoEmpMini[] = [
  {
    empresa: 1,
    cod_barras: "789000000001",
    preco_venda: 24.9,
    subcategoria_id: 10,
    produto: {
      id: 101,
      descricao: "Hambúrguer Clássico",
      imagem: null,
      cod_categoria: 2,
    },
  },
  {
    empresa: 1,
    cod_barras: "789000000002",
    preco_venda: 29.9,
    subcategoria_id: 10,
    produto: {
      id: 102,
      descricao: "Cheeseburger Duplo",
      imagem: null,
      cod_categoria: 2,
    },
  },
  {
    empresa: 1,
    cod_barras: "789000000003",
    preco_venda: 19.9,
    subcategoria_id: 11,
    produto: {
      id: 103,
      descricao: "Batata Especial",
      imagem: null,
      cod_categoria: 3,
    },
  },
  {
    empresa: 1,
    cod_barras: "789000000004",
    preco_venda: 14.9,
    subcategoria_id: 12,
    produto: {
      id: 104,
      descricao: "Refrigerante Lata",
      imagem: null,
      cod_categoria: 4,
    },
  },
];

export default function VitrineDestaques({
  produtos,
  titulo = "Destaques",
  verMaisHref = "/vitrine",
  onSelectProduto,
}: Props) {
  const lista = (produtos?.length ? produtos : MOCK_PRODUTOS).slice(0, 3);

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-base font-semibold">{titulo}</h2>
        <Link href={verMaisHref} className="text-sm text-primary hover:underline">
          Ver tudo
        </Link>
      </div>

      {/* Linha rolável no mobile, grid no desktop */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
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
      </div>
    </section>
  );
}
