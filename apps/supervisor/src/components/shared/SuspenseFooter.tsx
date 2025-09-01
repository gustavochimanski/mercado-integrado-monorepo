"use client";

import React from "react";

interface FooterSelecionadosButton {
  label: string;
  onClick: () => void;
  className?: string; // opcional, para estilos diferentes
}

interface FooterSelecionadosProps {
  count: number;
  visivel: boolean;
  onCancelar: () => void;
  botoes: FooterSelecionadosButton[];
  footerHeight?: number; // opcional
}

export function SuspenseFooter({
  count,
  visivel,
  onCancelar,
  botoes,
  footerHeight = 96, // default 24rem
}: FooterSelecionadosProps) {
  return (
    <div
      className={`
        fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-3 flex flex-col gap-3 items-center z-50 border
        transition-all duration-300 ease-in-out
        ${visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
      `}
      style={{ height: footerHeight }}
    >
      {/* Botão X no canto superior direito */}
      <button
        onClick={onCancelar}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Cancelar"
      >
        ✕
      </button>

      <span className="font-semibold">{count} selecionado(s)</span>

      <div className="flex gap-3 flex-wrap justify-center">
        {botoes.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${btn.className ?? ""} hover:opacity-80 transition`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
