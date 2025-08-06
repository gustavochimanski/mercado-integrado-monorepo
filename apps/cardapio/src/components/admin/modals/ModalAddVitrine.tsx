"use client";

import { useEffect, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Label } from "@cardapio/components/Shared/ui/label";
import { useMutateVitrine } from "@cardapio/services/useQueryVitrine";

interface ModalAddVitrineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  codCategoria: number;
}

export const ModalAddVitrine = ({
  open,
  onOpenChange,
  empresaId,
  codCategoria,
}: ModalAddVitrineProps) => {
  const [titulo, setTitulo] = useState("");
  const [ordem, setOrdem] = useState(0); // valor inicial padrão

  const { create }  = useMutateVitrine();

  function handleSubmit() {
    if (!titulo.trim()) return;

    create.mutate(
      {
        cod_empresa: empresaId,
        cod_categoria: codCategoria,
        titulo,
        ordem,
      },
      {
        onSuccess: () => {
          setTitulo("");
          setOrdem(0);
          onOpenChange(false);
        },
        onError: (err) => console.error("Erro ao criar seção:", err),
      }
    );
  }

  useEffect(() => {
    if (!open) {
      setTitulo("");
      setOrdem(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Seção</DialogTitle>
        </DialogHeader>

        <Label>Titulo</Label>
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Título da nova seção"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        
        <Label>Ordem</Label>
          <Input
            type="number"
            placeholder="Ordem (ex: 0, 1, 2...)"
            value={ordem}
            onChange={(e) => setOrdem(Number(e.target.value))}
          />

          <Button onClick={handleSubmit} disabled={create.isPending}>
            {create.isPending ? "Criando..." : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
