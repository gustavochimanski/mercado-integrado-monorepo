"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../Shared/ui/button";
import { Card, CardFooter } from "../../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ModalNovoProduto } from "../modals/ModalAddProduto";


interface Props {
  empresaId: number;
  codCategoria: number;    
  vitrineId: number;
  is_home?: boolean
}

export const CardAddProduto = ({
  empresaId,
  codCategoria,
  vitrineId,
  is_home
}: Props) => {
  const { isAdmin } = useUserContext();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isAdmin) return null;

  const sizeClass = is_home ? "w-[100px] h-[200px]" : "w-[120px] h-[220px]";

  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
        className={`${sizeClass}  snap-start flex flex-col justify-between overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-colors cursor-pointer`}
      >
        <div className="flex flex-col items-center gap-2 px-3 pt-3 flex-grow justify-center">
          <PlusCircle className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm font-medium text-center line-clamp-1 w-full">
            Adicionar Produto
          </div>
          <div className="text-sm text-muted-foreground">Novo item</div>
        </div>

        <CardFooter className="p-0">
          <Button
            size="sm"
            className="w-full rounded-none text-sm"
            variant="secondary"
            onClick={() => setModalOpen(true)}
          >
            Novo
          </Button>
        </CardFooter>
      </Card>

      <ModalNovoProduto
        open={modalOpen}
        onOpenChange={setModalOpen}
        empresaId={empresaId}
        codCategoria={codCategoria}     // ✅ agora envia também
        vitrineId={vitrineId}
      />
    </>
  );
};
