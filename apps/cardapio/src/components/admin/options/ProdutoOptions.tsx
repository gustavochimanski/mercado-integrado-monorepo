// src/components/Shared/Product/ProductOptions.tsx
"use client";

import { useState } from "react";

import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useMutateProduto } from "@cardapio/hooks/useQueryProduto";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@cardapio/components/Shared/ui/dropdown-menu";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";

interface ProductOptionsProps {
  codBarras: string;
  onEdit: () => void;
}

export function ProductOptions({
  codBarras,
  onEdit,
}: ProductOptionsProps) {
  const { isAdmin } = useUserContext();
  const { remove } = useMutateProduto();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isAdmin) return null;

  function handleConfirmRemove() {
    remove.mutate(codBarras);
  }

  return (
    <>
      <div className="absolute top-1 right-1 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 w-4 h-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 w-4 h-4" /> Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar remoção"
        description="Tem certeza que deseja remover este produto? Esta ação é irreversível."
        confirmText="Sim, remover"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
