"use client";

import { useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@cardapio/components/Shared/ui/dropdown-menu";
import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { useMutateCategoria } from "@cardapio/hooks/useMutateCategoria";
import {
  CircleArrowLeft,
  CircleArrowRight,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";

interface CategoryOptionsProps {
  categoryId: number;
  onEdit?: (id: number) => void;
}

const CategoryOptions = ({ categoryId, onEdit }: CategoryOptionsProps) => {
  const { isAdmin } = useUserContext();
  const { remove, moveRight, moveLeft } = useMutateCategoria();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isAdmin) return null;

  function handleConfirmRemove() {
    remove.mutate(categoryId, {
      onSettled: () => setConfirmOpen(false),
    });
  }

  function handleMoveRight() {
    moveRight.mutate(categoryId);
  }

  function handleMoveLeft() {
    moveLeft.mutate(categoryId);
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
            <DropdownMenuItem onClick={() => onEdit?.(categoryId)}>
              <Pencil className="mr-2 w-4 h-4" /> Editar
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 w-4 h-4" /> Remover
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleMoveRight}>
              <CircleArrowRight className="mr-2 w-4 h-4" /> Mover para Direita
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleMoveLeft}>
              <CircleArrowLeft className="mr-2 w-4 h-4" /> Mover para Esquerda
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modal de confirmação */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar remoção"
        description="Tem certeza que deseja remover esta categoria? Esta ação é irreversível."
        confirmText="Sim, remover"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default CategoryOptions;
