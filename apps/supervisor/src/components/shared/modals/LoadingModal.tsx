"use client";

import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
}

export default function LoadingModal({ open }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay com fundo cinza translúcido */}
      <div className="absolute inset-0 bg-gray-900/50" />

      {/* Conteúdo do modal */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 w-40 p-4 text-center bg-white shadow-lg rounded-lg border border-gray-200 pointer-events-none">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium text-gray-700">Carregando...</p>
      </div>
    </div>
  );
}
