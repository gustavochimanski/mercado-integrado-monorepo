"use client";

import React from "react";
import { Modal } from "../../ui/modal";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "../../ui/card";
import { Button } from "../../ui/button";

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
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} style={{ width: "350px", textAlign: "center" }}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex gap-4 justify-center">
          <Button onClick={() => {onConfirm(); onClose();}} variant="destructive">
            {confirmLabel}
          </Button>
          <Button onClick={onClose}>{cancelLabel}</Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
