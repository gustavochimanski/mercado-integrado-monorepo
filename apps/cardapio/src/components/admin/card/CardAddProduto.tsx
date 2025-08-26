"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../Shared/ui/button";
import { Card, CardFooter } from "../../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ModalNovoProduto } from "../modals/ModalAddProduto";


interface Props {
  empresaId: number;
  vitrineId: number;
}

export const CardAddProduto = ({
  empresaId,
  vitrineId,
}: Props) => {
  const { isAdmin } = useUserContext();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isAdmin) return null;


  return (
    <>
      <Card
        onClick={() => setModalOpen(true)}
        className={`min-w-[90px] max-w-[90px] h-[180px] snap-start flex flex-col justify-between overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-colors cursor-pointer`}
      >
        <div className="flex flex-col items-center gap-2 px-3 pt-3 flex-grow justify-center">
          <PlusCircle className="w-8 h-8 text-primary" />
          <div className="text-sm font-medium text-center line-clamp-1 w-full">
            Adicionar
          </div>
          <div className="text-sm text-center text-muted-foreground">Novo item</div>
        </div>

        <CardFooter className="p-0">
          <Button
            size="sm"
            className="w-full rounded-none text-background bg-primary text-sm"
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
        vitrineId={vitrineId}
      />
    </>
  );
};
