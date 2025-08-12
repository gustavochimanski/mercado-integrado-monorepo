"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Card } from "../../Shared/ui/card";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { ModalAddVitrine } from "../modals/ModalAddVitrine";

interface Props {
  is_home: boolean;
  cod_categoria: number | null;
  empresa_id: number
}

const CardAddVitrine = ({ is_home, cod_categoria,empresa_id}: Props) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);

  // Se for home, categoria não deve ser vinculada
  const categoriaId = is_home ? null : cod_categoria;

  if (!isAdmin) return null;

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer h-[200px] bg-muted flex flex-col items-center w-full justify-center gap-1 p-2 border-dashed border-2 border-gray-300 hover:border-primary transition-colors"
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
          <PlusCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <span className="block text-center text-sm font-semibold truncate max-w-full">
          Nova Seção
        </span>
      </Card>

      <ModalAddVitrine
        open={open}
        onOpenChange={setOpen}
        codCategoria={categoriaId}
        is_home={is_home}
        empresa_id={empresa_id}
      />
    </>
  );
};

export default CardAddVitrine;
