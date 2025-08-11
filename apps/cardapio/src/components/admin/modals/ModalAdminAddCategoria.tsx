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
import { useMutateCategoria } from "@cardapio/services/useMutateCategoria";

interface ModalCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: number | null;
  titulo?: string;
  empresaId: number
}

export const ModalAdminAddCategoria = ({
  open,
  onOpenChange,
  parentId = null,
  empresaId
}: ModalCategoriaProps) => {
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | undefined>(undefined);


  const { create } = useMutateCategoria();
  const isLoading = create.isPending;

  function handleSubmit() {
    if (!descricao.trim()) return;

    create.mutate(
      {
        descricao, imagem,
        cod_empresa: empresaId,
        parent_id: parentId
      },
      {
        onSuccess: () => {
          setDescricao("");
          setImagem(undefined);
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Erro ao criar categoria:", error);
        },
      }
    );
  }

  useEffect(() => {
    if (!open) {
      setDescricao("");
      setImagem(undefined);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adcionar Categoria</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Descrição da nova categoria"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImagem(file);
            }}
          />

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
