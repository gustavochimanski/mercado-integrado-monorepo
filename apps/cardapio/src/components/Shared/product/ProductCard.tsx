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
  className="w-[120px] h-[180px] flex flex-col overflow-hidden gap-0 p-0 cursor-pointer hover:shadow-lg transition-all duration-200 rounded-lg border-0 shadow-md bg-white"
  onClick={onOpenSheet}
>
  {/* Imagem principal */}
  <div className="relative w-full h-[100px] overflow-hidden flex-shrink-0 bg-gray-100">
    <Badge
      className="absolute top-2 left-2 z-10 w-fit text-[9px] px-2 py-0.4 rounded-full bg-red-500 text-white font-semibold"
      title="-20% off"
      variant="default"
    >
      -20%
    </Badge>

    <Image
      src={produtoBase.imagem || "/semimagem.png"}
      alt={produtoBase.descricao || "Produto"}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, 200px"
    />
  </div>

  {/* Informações do produto */}
  <div className="flex flex-col p-1 flex-1 min-h-0 bg-white">
    <h1 className="text-xs font-medium leading-tight text-gray-900 bg -black min-h- mb-auto">
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
