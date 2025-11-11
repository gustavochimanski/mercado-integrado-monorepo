"use client";

import { useEffect, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
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

  const { create, update } = useMutateCategoria();
  const isLoading = create.isPending || update.isPending;


  const handleSubmit = async () => {
    if (!descricao.trim()) return;

    if (categoriaId) {
      // 🟡 Modo edição - apenas descrição (imagem será no ModalEditCategoria)
      update.mutate({
        id: categoriaId,
        descricao,
        cod_empresa: empresaId,
        parent_id: parentId,
      });
      closeModal();
    } else {
      // 🟢 Modo criação - apenas descrição
      create.mutate({
        descricao,
        cod_empresa: empresaId,
        parent_id: parentId,
      });
      closeModal();
    }
  };

  function closeModal() {
    setDescricao("");
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) {
      setDescricao("");
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
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição da categoria</Label>
            <Input
              id="descricao"
              placeholder="Digite a descrição da categoria"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !descricao.trim()}
            className="w-full"
          >
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
