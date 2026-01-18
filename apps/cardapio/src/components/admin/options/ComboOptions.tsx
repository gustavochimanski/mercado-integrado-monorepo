// src/components/admin/options/ComboOptions.tsx
"use client";

import { useState } from "react";

import { useUserContext } from "@cardapio/hooks/auth/userContext";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@cardapio/components/Shared/ui/dropdown-menu";
import { ConfirmDialog } from "@cardapio/components/Shared/ConfirmDialog";
import { useMutateVitrine } from "@cardapio/services/vitrine";
import { toast } from "sonner";

interface ComboOptionsProps {
  comboId: number;
  onEdit: () => void;
  vitrineId?: number;
}

export function ComboOptions({ comboId, onEdit, vitrineId }: ComboOptionsProps) {
  const { isAdmin } = useUserContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { desvincularCombo } = useMutateVitrine();
  if (!isAdmin) return null;

  function handleConfirmRemove() {
    if (typeof vitrineId !== "number") {
      toast.error("Não foi possível identificar a vitrine para desvincular.");
      return;
    }
    desvincularCombo.mutate(
      { vitrineId, combo_id: comboId },
      { onSuccess: () => setConfirmOpen(false) }
    );
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
              <Trash2 className="mr-2 w-4 h-4" /> Desvincular
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirmar remoção"
        description="Tem certeza que deseja desvincular este combo? Ele não vai mais aparecer nessa vitrine."
        confirmText="Sim, Desvincular"
        cancelText="Cancelar"
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
