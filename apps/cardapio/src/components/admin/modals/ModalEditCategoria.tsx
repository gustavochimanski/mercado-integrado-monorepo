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
import { useMutateCategoria } from "@cardapio/services/useQueryCategoria";
import Image from "next/image";
import { useHome } from "@cardapio/services/useQueryHome";
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
  // 1) Busca categorias via HomeResponse
  const {
    data,
    isLoading,
    isError,
  } = useHome(empresaId);

  const categorias: CategoriaMini[] = data?.categorias ?? [];

  // 2) Encontra a categoria selecionada
  const categoria = categorias.find((c) => c.id === categoriaId);

  // 3) Estados do form
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState<File | undefined>(undefined);

  // 4) Mutação de update
  const { update } = useMutateCategoria();
  const isUpdating = update.isPending;

  // 5) Popula o form quando a categoria carrega
  useEffect(() => {
    if (categoria) {
      setDescricao(categoria.label);
      setImagemFile(undefined);
    }
  }, [categoria]);

  // 6) Handle salvar
  function handleSubmit() {
    if (!descricao.trim() || !categoria) return;

    update.mutate(
      {
        cod_empresa: empresaId,
        id: categoriaId,
        descricao,
        slug: categoria.slug,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  }

  // 7) Loading / erro
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

  // 8) Render
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
