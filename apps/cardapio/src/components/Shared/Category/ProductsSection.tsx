"use client";

import React from "react";
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

interface Props {
  categoriaLabel?: string;
  produtos: ProdutoEmpMini[];
  onAdd?: (p: ProdutoEmpMini) => void;
  subcategoriaId: number;
  codCategoria: number;
  value: string; // valor único do item (ex: id ou slug)
  bgClass: string
}

export default React.memo(function ProductsSection({
  categoriaLabel,
  produtos,
  onAdd,
  subcategoriaId,
  codCategoria,
  value,
  bgClass
}: Props) {
  return (
      <AccordionItem value={value} className={`${bgClass} `}>
        <AccordionTrigger
          className="text-xl font-bold"
          rightElement={
            produtos[0]?.produto.imagem ? (
              <div className="p-1 bg-white rounded-full">
                <img
                  src={produtos[0].produto.imagem}
                  alt={produtos[0].produto.descricao}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            ) : null
          }
        >
          {categoriaLabel}
        </AccordionTrigger>


        <AdminSecaoSubCategOptions  />

        <AccordionContent>
          <div className="flex overflow-x-auto items-stretch gap-2  hide-scrollbar px-2">
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
        </AccordionContent>
      </AccordionItem>
  );
});
