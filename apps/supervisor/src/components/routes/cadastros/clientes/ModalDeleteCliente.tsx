"use client";

import { Button } from "@supervisor/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import React from "react";

interface ModalDeleteClienteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: any;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const ModalDeleteCliente: React.FC<ModalDeleteClienteProps> = ({
  open,
  onOpenChange,
  cliente,
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
            Você tem certeza que deseja excluir o cliente?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {cliente && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Nome:</strong> {cliente.nome}
              </p>
              <p className="text-sm text-gray-600">
                <strong>CPF:</strong> {cliente.cpf}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {cliente.email}
              </p>
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
                <Trash2 className="w-4 h-4" /> Excluir Cliente
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
