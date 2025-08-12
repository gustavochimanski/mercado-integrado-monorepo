"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import {
  useCategoriaById,
  useMutateCategoria,
} from "@cardapio/services/useQueryCategoria";
import Image from "next/image";
import type { CategoriaMini } from "@cardapio/services/useQueryHome";

interface ModalEditCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  categoriaId: number;
}

export const ModalEditCategoria = ({
  open,
  onOpenChange,
  empresaId,
  categoriaId,
}: ModalEditCategoriaProps) => {
  // Busca a categoria pelo ID
  const {
    data: categoria,
    isLoading,
    isError,
  } = useCategoriaById(categoriaId);

  // Estados do form
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState<File | undefined>(undefined);

  // Mutations
  const { update, uploadImagem } = useMutateCategoria();
  const isUpdating = update.isPending || uploadImagem.isPending;

  // Preenche o form quando carrega
  useEffect(() => {
    if (categoria) {
      setDescricao(categoria.label);
      setImagemFile(undefined);
    }
  }, [categoria]);

  // Salvar alterações
  function handleSubmit() {
    if (!descricao.trim() || !categoria) return;

    // Atualiza a categoria
    update.mutate(
      {
        cod_empresa: empresaId,
        id: categoria.id,
        descricao,
        slug: categoria.slug,
        parent_id: categoria.parent_id ?? null,
        posicao: categoria.posicao,
      },
      {
        onSuccess: () => {
          // Se tiver imagem nova, faz upload
          if (imagemFile) {
            uploadImagem.mutate({
              id: categoria.id,
              cod_empresa: empresaId,
              imagem: imagemFile,
            });
          }
          onOpenChange(false);
        },
      }
    );
  }

  // Loading / Erro
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregando categoria...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  if (isError || !categoria) return null;

  // Render
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {categoria.imagem && !imagemFile && (
            <div className="relative w-20 h-20">
              <Image
                src={categoria.imagem}
                alt="Imagem atual"
                fill
                className="object-cover rounded"
              />
            </div>
          )}

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImagemFile(file);
            }}
          />
        </div>
        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
