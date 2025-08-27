"use client";

import React from "react";

interface RevisaoStepProps {
  items: {
    cod_barras: string;
    nome: string;
    quantity: number;
    preco: number;
  }[];
  observacao?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
  };
  pagamento?: {
    nome?: string;
  };
  total: number;
}

export default function RevisaoStep({ items, observacao, endereco, pagamento, total }: RevisaoStepProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Revisão</h2>

      {/* Itens do pedido */}
      <div>
        <h3 className="font-semibold">Itens:</h3>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.cod_barras}>
              {item.quantity}x {item.nome} – R$ {(item.preco * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      {/* Observação */}
      <p><strong>Observação:</strong> {observacao || "Nenhuma"}</p>

      {/* Endereço */}
      <p>
        <strong>Endereço:</strong>{" "}
        {endereco
          ? `${endereco.logradouro || ""}${endereco.numero ? `, ${endereco.numero}` : ""}${endereco.bairro ? ` - ${endereco.bairro}` : ""}${endereco.cidade ? ` (${endereco.cidade})` : ""}`
          : "Não informado"}
      </p>

      {/* Pagamento */}
      <p><strong>Pagamento:</strong> {pagamento?.nome || "Não informado"}</p>

      {/* Total */}
      <div className="bg-gray-100 p-3 rounded-lg text-lg font-bold flex justify-between">
        <span>Total:</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
