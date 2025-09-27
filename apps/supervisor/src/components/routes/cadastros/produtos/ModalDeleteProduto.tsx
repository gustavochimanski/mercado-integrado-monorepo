"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Trash2, AlertTriangle, Package } from "lucide-react";
import React from "react";

interface ModalDeleteProdutoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: any;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const ModalDeleteProduto: React.FC<ModalDeleteProdutoProps> = ({
  open,
  onOpenChange,
  produto,
  onConfirm,
  isDeleting,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir o produto?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {produto && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Detalhes do Produto</span>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Código de Barras:</strong> {produto.cod_barras}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Descrição:</strong> {produto.descricao}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Preço:</strong> R$ {produto.preco_venda}
              </p>
              {produto.custo && (
                <p className="text-sm text-gray-600">
                  <strong>Custo:</strong> R$ {produto.custo}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Trash2 className="w-4 h-4 animate-pulse" /> Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> Excluir Produto
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
