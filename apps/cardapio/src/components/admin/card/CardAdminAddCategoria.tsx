"use client";

import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { ModalAdminAddCategoria } from "../modals/ModalAdminAddCategoria";
import { useUserContext } from "@cardapio/hooks/auth/userContext";

interface Props {
  parentID: number | null;
  empresaId: number;
}

const CardAdminAddCategoria = ({ empresaId, parentID }: Props) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="relative">
        <div
          onClick={() => setOpen(true)}
          className="flex flex-col items-center w-16 gap-1 rounded-lg  transition-colors cursor-pointer"
        >
          <div className="relative w-full aspect-square rounded-full overflow-hidden bg-muted border-3 border-dashed flex items-center justify-center">
            <CirclePlus className="w-6 text-muted-foreground" />
          </div>
          <span className="block text-center text-xs font-medium text-foreground/80  max-w-full px-1">
            Nova Categoria
          </span>
        </div>
      </div>

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
