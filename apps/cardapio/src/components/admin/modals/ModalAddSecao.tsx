// packages/ui/components/shared/ModalAddSecao.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@cardapio/components/ui/button";
import { Input } from "@cardapio/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/ui/dialog";
import { useCreateSubcategoria } from "@cardapio/hooks/useSecoes";
import { Label } from "@cardapio/components/ui/label";

interface ModalAddSecaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  codCategoria: number;
}

export const ModalAddSecao = ({
  open,
  onOpenChange,
  empresaId,
  codCategoria,
}: ModalAddSecaoProps) => {
  const [titulo, setTitulo] = useState("");
  const [ordem, setOrdem] = useState(0); // valor inicial padrão

  const create = useCreateSubcategoria();
  const isLoading = create.isPending;

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

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
