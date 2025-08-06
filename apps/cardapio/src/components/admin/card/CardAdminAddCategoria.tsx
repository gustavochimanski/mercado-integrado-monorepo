"use client";

import { CirclePlus } from "lucide-react";
import { Card } from "../../Shared/ui/card";
import { useState } from "react";
import { ModalAdminAddCategoria } from "../modals/ModalAdminAddCategoria";
import { useUserContext } from "@cardapio/hooks/auth/userContext";

interface Props {
  parentID: number | null
  empresaId: number
}
const CardAdminAddCategoria = ({ empresaId, parentID}: Props) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);


  if (!isAdmin) return null;

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-muted flex flex-col items-center w-[120px] full gap-1 p-2 border-dashed border-2 border-gray-300"
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
          <CirclePlus className="w-8 h-8 text-muted-foreground" />
        </div>
        <span className="block text-center text-sm font-semibold truncate max-w-full">
          Nova Categoria
        </span>
      </Card>

      <ModalAdminAddCategoria
        open={open}
        onOpenChange={setOpen}
        parentId={parentID} 
        empresaId={empresaId}      
      />

    </>
  );
};

export default CardAdminAddCategoria;
