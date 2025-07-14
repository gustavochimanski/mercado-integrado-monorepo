// ProductCard.tsx
import Image from "next/image";
import { ProdutoEmpMini } from "../../types/Produtos";
import { Button } from "./ui/button";
import { Card, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";

type Props = {
  produto: ProdutoEmpMini;
  onAdd?: () => void;
};

export function ProductCard({ produto, onAdd }: Props) {
  const { produto: produtoBase, preco_venda } = produto;

  return (
    <Card className="w-[120px] h-[220px] flex flex-col justify-between overflow-hidden p-0 gap-0" onClick={onAdd}>
      <div className="flex flex-col items-start gap-2 flex-grow">
        {/* Imagem */}
          <div className="relative w-full aspect-square">
            {/* Badge posicionado no canto superior esquerdo */}
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


        {/* Descrição (1 linha) */}
        <div className="flex flex-col mx-1 gap-1">
          <h1 className="text-xs font-medium text-start line-clamp-1 w-full break-all">
            {produtoBase.descricao || "Sem nome"}
          </h1>

          {/* Preço */}
          <p className="text-sm text-muted-foreground">
            R$ {Number(preco_venda).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Botão */}
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
  );
}
