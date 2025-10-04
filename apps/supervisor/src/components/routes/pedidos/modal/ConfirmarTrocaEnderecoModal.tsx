"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@supervisor/components/ui/alert-dialog";
import { MapPin } from "lucide-react";

interface ConfirmarTrocaEnderecoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  enderecoAtual?: string;
  enderecoNovo?: string;
}

export function ConfirmarTrocaEnderecoModal({
  isOpen,
  onClose,
  onConfirm,
  enderecoAtual,
  enderecoNovo
}: ConfirmarTrocaEnderecoModalProps) {

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Confirmar troca de endereço?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p>Você está prestes a alterar o endereço de entrega deste pedido.</p>

              {enderecoAtual && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-red-900 mb-1">Endereço atual:</p>
                  <p className="text-sm text-red-700">{enderecoAtual}</p>
                </div>
              )}

              {enderecoNovo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-900 mb-1">Novo endereço:</p>
                  <p className="text-sm text-green-700">{enderecoNovo}</p>
                </div>
              )}

              <p className="text-sm text-gray-600">
                Esta ação pode afetar o cálculo de frete e disponibilidade de entrega.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar Troca
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
