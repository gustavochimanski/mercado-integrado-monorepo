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
import { useMutateCategoria } from "@cardapio/services/useQueryCategoria";

interface ModalCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: number | null;
  empresaId: number;
}

export const ModalAdminAddCategoria = ({
  open,
  onOpenChange,
  parentId = null,
  empresaId,
}: ModalCategoriaProps) => {
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | undefined>(undefined);

  const { create, uploadImagem } = useMutateCategoria();
  const isLoading = create.isPending || uploadImagem.isPending;

  function handleSubmit() {
    if (!descricao.trim()) return;

    create.mutate(
      {
        descricao,
        cod_empresa: empresaId,
        parent_id: parentId,
        slug: descricao.toLowerCase().replace(/\s+/g, "-"), // opcional
      },
      {
        onSuccess: (res) => {
          // Se tiver imagem, chama o upload
          if (imagem) {
            uploadImagem.mutate({
              id: res.data.id, // id retornado pelo backend
              cod_empresa: empresaId,
              imagem,
            });
          }
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
          <DialogTitle>Adicionar Categoria</DialogTitle>
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
