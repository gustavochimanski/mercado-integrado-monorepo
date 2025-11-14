"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "../../Shared/ui/button";
import { Card } from "../../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ModalSelecionarTipo } from "../modals/ModalSelecionarTipo";


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
        className={`w-full h-full min-w-[140px] max-w-[140px] flex flex-col justify-center items-center overflow-hidden p-0 border-dashed border-2 border-gray-300 hover:border-primary transition-all duration-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer bg-gray-50`}
      >
        <div className="flex flex-col items-center gap-2 px-3 flex-grow justify-center">
          <PlusCircle className="w-10 h-10 text-primary" />
          <div className="text-sm font-medium text-center text-gray-700">
            Adicionar item
          </div>
        </div>
      </Card>

      <ModalSelecionarTipo
        open={modalOpen}
        onOpenChange={setModalOpen}
        empresaId={empresaId}
        vitrineId={vitrineId}
      />
    </>
  );
};
