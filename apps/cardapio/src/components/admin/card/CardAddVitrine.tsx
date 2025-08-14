"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Card } from "../../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ModalVitrineMarkHome } from "../modals/ModalAddVitrineHome";
import { ModalVitrineCreateSimple } from "../modals/ModalAddVitrine";

interface Props {
  is_home: boolean;
  cod_categoria: number | null;
  className?: string;
}

const CardAddVitrine = ({
  is_home,
  cod_categoria,
  className
}: Props) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className={`cursor-pointer h-[200px] bg-muted flex flex-col items-center w-full justify-center gap-1 p-2 border-dashed border-2 border-gray-300 hover:border-primary transition-colors ${className ?? ""}`}
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
          <PlusCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <span className="block text-center text-sm font-semibold truncate max-w-full">
          Nova Seção
        </span>
      </Card>

      {is_home ? (
        <ModalVitrineMarkHome
          open={open}
          onOpenChange={setOpen}
          codCategoria={cod_categoria} // pode vir null, sem problema
        />
      ) : (
        <ModalVitrineCreateSimple
          open={open}
          onOpenChange={setOpen}
          codCategoria={cod_categoria!}
        />
      )}
    </>
  );
};

export default CardAddVitrine;
