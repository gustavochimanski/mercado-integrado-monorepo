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

export default function RevisaoStep({
  items,
  observacao,
  endereco,
  pagamento,
  total,
}: RevisaoStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Revisão do Pedido</h2>
        {/* Endereço */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h3 className="mb-1 font-semibold text-base">Endereço</h3>
          <p className="text-sm text-gray-700">
            {endereco
              ? `${endereco.logradouro || ""}${
                  endereco.numero ? `, ${endereco.numero}` : ""
                }${endereco.bairro ? ` - ${endereco.bairro}` : ""}${
                  endereco.cidade ? ` (${endereco.cidade})` : ""
                }`
              : "Não informado"}
          </p>
        </div>

      {/* Pagamento */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-1 font-semibold text-base">Pagamento</h3>
        <p className="text-sm text-gray-700">
          {pagamento?.nome || "Não informado"}
        </p>
      </div>

      {/* Observação */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-1 font-semibold text-base">Observação</h3>
        <p className="text-sm text-gray-700">
          {observacao?.trim() || "Nenhuma"}
        </p>
      </div>

      {/* Total */}
      <div className="rounded-2xl bg-gray-100 p-4 shadow-inner">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">R$ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Itens do pedido */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="mb-2 font-semibold text-base">Itens</h3>
        <ul className="divide-y divide-gray-200">
          {items.map((item) => (
            <li
              key={item.cod_barras}
              className="flex flex-col py-2 text-sm"
            >
              <span >
                <strong>{item.quantity} x</strong>  {item.nome}
              </span>
              <span className="font-medium text-end text-gray-800">
                R$ {(item.preco * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>




    </div>
  );
}
