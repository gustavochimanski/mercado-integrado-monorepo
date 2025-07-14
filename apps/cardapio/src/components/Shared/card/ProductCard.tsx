// src/components/Shared/Product/ProductCard.tsx
"use client";

import Image from "next/image";
import { ProdutoEmpMini } from "../../../types/Produtos";
import { Button } from "../ui/button";
import { Card, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { ProductOptions } from "@cardapio/components/admin/options/ProdutoOptions";

type Props = {
  produto: ProdutoEmpMini;
  onAdd?: () => void;
  onEdit?: (codBarras: string) => void;
};

export function ProductCard({
  produto,
  onAdd,
  onEdit,
}: Props) {
  const { produto: produtoBase, preco_venda } = produto;
  const codBarras = produto.cod_barras;

  return (
    <div className="relative">
      {/* Menu de opções (apenas admin) */}
      <ProductOptions
        codBarras={codBarras}
        onEdit={() => onEdit?.(codBarras)}
      />

      <Card
        className="w-[120px] h-[220px] flex flex-col justify-between overflow-hidden p-0 gap-0 cursor-pointer"
        onClick={onAdd}
      >
        <div className="flex flex-col items-start gap-2 flex-grow">
          {/* Imagem e Badge */}
          <div className="relative w-full aspect-square">
            <Badge
              className="absolute top-1 left-1 z-10 w-fit text-xs max-w-full whitespace-nowrap"
              title="-20% off"
              variant="default"
            >
              -20%
            </Badge>
            <Image
              src={produtoBase.imagem || "/placeholder.jpg"}
              alt={produtoBase.descricao || "Produto"}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </div>

          {/* Descrição e Preço */}
          <div className="flex flex-col mx-1 gap-1">
            <h1 className="text-xs font-medium text-start line-clamp-1 w-full break-all">
              {produtoBase.descricao || "Sem nome"}
            </h1>
            <p className="text-sm text-muted-foreground">
              R$ {Number(preco_venda).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Botão Adicionar */}
        <CardFooter className="p-0 mt-0">
          <Button
            size="sm"
            className="w-full rounded-none text-sm"
            onClick={onAdd}
          >
            Adicionar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
