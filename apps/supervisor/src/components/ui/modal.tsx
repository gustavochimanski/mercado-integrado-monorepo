import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  style?: React.CSSProperties;
}

export function Modal({ children, onClose, style }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 overflow-hidden"
      onClick={onClose}
    >
      <div
        style={style}
        className="relative flex flex-col bg-white rounded shadow-lg max-w-[90vw] max-h-[90vh] w-full h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <Button
          onClick={onClose}
          className="absolute w-10 h-10 -top-5 -right-5 p-2 rounded-full shadow-md transition z-20"
          aria-label="Fechar modal"
          variant={"destructive"}
        >
          <X size={20} />
        </Button>

        {/* Conteúdo com scroll, se necessário */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
  {children}
</div>

      </div>
    </div>
  );
}
