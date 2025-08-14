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
  categoriaId?: number; // 👈 se vier, é modo edição
}

export const ModalAdminAddCategoria = ({
  open,
  onOpenChange,
  parentId = null,
  empresaId,
  categoriaId,
}: ModalCategoriaProps) => {
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<File | undefined>(undefined);

  const { create, uploadImagem, update } = useMutateCategoria();
  const isLoading =
    create.isPending || uploadImagem.isPending || update.isPending;

  function handleSubmit() {
    if (!descricao.trim() && !imagem) return;

    if (categoriaId) {
      // 🟡 Modo edição
      if (descricao.trim()) {
        update.mutate(
          {
            id: categoriaId,
            descricao,
            cod_empresa: empresaId,
            parent_id: parentId,
            slug: descricao.toLowerCase().replace(/\s+/g, "-"),
          },
          {
            onSuccess: () => {
              if (imagem) {
                uploadImagem.mutate({
                  id: categoriaId,
                  cod_empresa: empresaId,
                  imagem,
                });
              }
              closeModal();
            },
          }
        );
      } else if (imagem) {
        // Atualiza só imagem
        uploadImagem.mutate(
          {
            id: categoriaId,
            cod_empresa: empresaId,
            imagem,
          },
          { onSuccess: closeModal }
        );
      }
    } else {
      // 🟢 Modo criação
      create.mutate(
        {
          descricao,
          cod_empresa: empresaId,
          parent_id: parentId,
          slug: descricao.toLowerCase().replace(/\s+/g, "-"),
        },
        {
          onSuccess: (res) => {
            if (imagem) {
              uploadImagem.mutate({
                id: res.data.id,
                cod_empresa: empresaId,
                imagem,
              });
            }
            closeModal();
          },
        }
      );
    }
  }

  function closeModal() {
    setDescricao("");
    setImagem(undefined);
    onOpenChange(false);
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
          <DialogTitle>
            {categoriaId ? "Editar Categoria" : "Adicionar Categoria"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Descrição da categoria"
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
            {isLoading
              ? categoriaId
                ? "Salvando..."
                : "Criando..."
              : categoriaId
              ? "Salvar alterações"
              : "Criar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
