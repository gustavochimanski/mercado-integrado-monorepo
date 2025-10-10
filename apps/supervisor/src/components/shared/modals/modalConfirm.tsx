"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  // Controla se o modal está visível
  isOpen: boolean;
  // Título exibido no cabeçalho do modal
  title: string;
  // Descrição exibida no modal
  description: string;
  // Função chamada ao fechar o modal (por exemplo, clicando em "Cancelar")
  onClose: () => void;
  // Função chamada ao confirmar a ação (por exemplo, clicando em "Confirmar")
  onConfirm: () => void;
  // Rótulo opcional para o botão de confirmação (padrão: "Confirmar")
  confirmLabel?: string;
  // Rótulo opcional para o botão de cancelamento (padrão: "Cancelar")
  cancelLabel?: string;
  // Variante do botão de confirmação (padrão: "destructive")
  variant?: "default" | "destructive";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "destructive",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
