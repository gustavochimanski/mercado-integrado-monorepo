// ProductCard.tsx
import Image from "next/image";
import { ProdutoEmpMini } from "../../types/Produtos";
import { Button } from "./ui/button";
import { Card, CardFooter } from "./ui/card";

type Props = {
  produto: ProdutoEmpMini;
  onAdd?: () => void;
};

export function ProductCard({ produto, onAdd }: Props) {
  const { produto: produtoBase, preco_venda } = produto;

  return (
    <Card className="w-[120px] h-[220px] flex flex-col justify-between overflow-hidden p-0">
      <div className="flex flex-col items-start gap-1 flex-grow">
        {/* Imagem */}
        <div className="relative w-full aspect-square">
          <Image
            src={produtoBase.imagem || "/placeholder.jpg"}
            alt={produtoBase.descricao || "Produto"}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </div>

        {/* Descrição (1 linha) */}
        <div className="mx-1">
          <div className="text-sm font-medium text-start line-clamp-1 w-full">
            {produtoBase.descricao || "Sem nome"}
          </div>

          {/* Preço */}
          <div className="text-sm text-muted-foreground">
            R$ {Number(preco_venda).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Botão */}
      <CardFooter className="p-0">
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
