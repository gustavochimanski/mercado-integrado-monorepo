// components/admin/card/CardAddSecaoSubCateg.tsx
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Card } from "../../ui/card";
import { useUserContext } from "@packs/auth";
import { ModalAddSecao } from "../modals/ModalAddSecao";

interface Props {
  empresaId: number;
  codCategoria: number;
}

const CardAddSecaoSubCateg = ({ empresaId, codCategoria }: Props) => {
  const { isAdmin } = useUserContext();
  const [open, setOpen] = useState(false);

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

      <ModalAddSecao
        open={open}
        onOpenChange={setOpen}
        empresaId={empresaId}
        codCategoria={codCategoria}
      />
    </>
  );
};

export default CardAddSecaoSubCateg;
