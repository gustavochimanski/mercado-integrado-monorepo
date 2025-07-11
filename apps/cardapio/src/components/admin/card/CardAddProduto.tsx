import { PlusCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardFooter } from "../../ui/card";
import { useUserContext } from "@packs/auth";

const CardAddProduto = () => {
  const { isAdmin } = useUserContext();

  if (!isAdmin) return null;

  return (
    <Card
  className="min-w-[120px] w-[120px] h-[220px] snap-start flex flex-col justify-between overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-colors"
>

      {/* Conteúdo central — mesma estrutura do ProductCard */}
      <div className="flex flex-col items-center gap-2 px-3 pt-3 flex-grow justify-center">
        <PlusCircle className="w-8 h-8 text-muted-foreground" />
        <div className="text-sm font-medium text-center line-clamp-1 w-full">
          Adicionar Produto
        </div>
        <div className="text-sm text-muted-foreground">Novo item</div>
      </div>

      {/* Botão (mesmo estilo do original) */}
      <CardFooter className="p-0">
        <Button
          size="sm"
          className="w-full rounded-none text-sm"
          variant="secondary"
        >
          Novo
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardAddProduto;
