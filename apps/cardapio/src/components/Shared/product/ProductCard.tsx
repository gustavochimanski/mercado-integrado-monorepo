"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { Card, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { ProductOptions } from "@cardapio/components/admin/options/ProdutoOptions";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

type Props = {
  produto: ProdutoEmpMini;
  onOpenSheet?: () => void;
  onEdit?: (codBarras: string) => void;
  empresa_id?: number;
  vitrineId?: number;
};

export function ProductCard({ produto, onOpenSheet, onEdit, empresa_id, vitrineId }: Props) {
  const { produto: produtoBase, preco_venda } = produto;
  const codBarras = produto.cod_barras;
  const price = Number(preco_venda) || 0;

  return (
    <div className="relative">
      <ProductOptions
        codBarras={codBarras}
        onEdit={() => onEdit?.(codBarras)}
        empresa_id={empresa_id!}
        vitrineId={vitrineId}
      />

<Card
  className="w-[140px] h-[200px] flex flex-col overflow-hidden p-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg border-0 shadow-md bg-white"
  onClick={onOpenSheet}
>
  {/* Imagem principal */}
  <div className="relative w-full h-[110px] overflow-hidden flex-shrink-0 bg-gray-100">
    <Badge
      className="absolute top-2 left-2 z-10 w-fit text-[9px] px-1.5 py-0.5 rounded-full bg-red-500 text-white font-semibold"
      title="-20% off"
      variant="default"
    >
      -20%
    </Badge>

    <Image
      src={produtoBase.imagem || "/placeholder.jpg"}
      alt={produtoBase.descricao || "Produto"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 200px"
    />
  </div>

  {/* Informações do produto */}
  <div className="flex flex-col px-2.5 pt-2 pb-2.5 gap-1.5 flex-1 min-h-0 bg-white">
    <h1 className="text-xs font-medium line-clamp-2 leading-tight text-gray-900 min-h-[38px]">
      {produtoBase.descricao || "Sem nome"}
    </h1>
    <div className="flex items-center justify-between mt-auto">
      <p className="text-sm font-bold text-gray-900 leading-none">
        R$ {price.toFixed(2).replace(".", ",")}
      </p>
      <Button
        size="sm"
        className="w-7 h-7 p-0 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onOpenSheet?.();
        }}
      >
        <span className="text-base font-bold leading-none">+</span>
      </Button>
    </div>
  </div>
</Card>

    </div>
  );
}
