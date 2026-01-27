// components/admin/modals/ModalVitrineCreateSimple.tsx
"use client";

import * as React from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Label } from "@cardapio/components/Shared/ui/label";
import { useMutateVitrine } from "@cardapio/services/vitrine";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codCategoria?: number | null;
}

export function ModalVitrineCreateSimple({
  open,
  onOpenChange,
  codCategoria,
}: Props) {
  // Dados da nova vitrine
  const [titulo, setTitulo] = React.useState("");

  const { create } = useMutateVitrine();

  function handleCreate() {
    if (!titulo.trim()) return;

    create.mutate(
      {
        ...(typeof codCategoria === "number" ? { cod_categoria: codCategoria } : {}),
        titulo: titulo.trim(),
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  }

  function reset() {
    setTitulo("");
  }

  React.useEffect(() => {
    if (!open) reset();
  }, [open]); // eslint-disable-line

  const canCreate = !!titulo.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar nova vitrine</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Campo título */}
          <div className="flex flex-col gap-2">
            <Label>Título</Label>
            <Input
              placeholder="Ex.: Ofertas da Semana"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Botão criar */}
          <Button
            onClick={handleCreate}
            disabled={create.isPending || !canCreate}
            className="w-full"
          >
            {create.isPending ? "Criando..." : "Criar vitrine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
