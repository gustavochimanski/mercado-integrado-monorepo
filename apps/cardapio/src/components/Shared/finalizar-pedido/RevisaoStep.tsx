"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Separator } from "@cardapio/components/Shared/ui/separator";
import { Trash2 } from "lucide-react";

interface Item {
  cod_barras: string;
  nome: string;
  quantity: number;
  preco: number;
}

interface RevisaoStepProps {
  items: Item[];
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

  // funções para modificar os itens
  inc?: (cod_barras: string) => void;
  dec?: (cod_barras: string) => void;
  remove?: (cod_barras: string) => void;
}

export default function RevisaoStep({
  items,
  observacao,
  endereco,
  pagamento,
  total,
  inc,
  dec,
  remove,
}: RevisaoStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">Revisão do Pedido</h2>

      {/* Endereço */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Endereço</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {endereco
            ? `${endereco.logradouro || ""}${
                endereco.numero ? `, ${endereco.numero}` : ""
              }${endereco.bairro ? ` - ${endereco.bairro}` : ""}${
                endereco.cidade ? ` (${endereco.cidade})` : ""
              }`
            : "Não informado"}
        </CardContent>
      </Card>

      {/* Pagamento */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {pagamento?.nome || "Não informado"}
        </CardContent>
      </Card>

      {/* Observação */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Observação</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {observacao?.trim() || "Nenhuma"}
        </CardContent>
      </Card>

      {/* Itens do pedido */}
      <Card className="gap-0">
          <CardTitle className="text-base mx-3">Itens</CardTitle>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.cod_barras}
                className="flex flex-col py-2 px-4 text-sm gap-2"
              >
                <span>
                  <strong>{item.quantity} x</strong> {item.nome}
                </span>
                  
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    R$ {(item.preco * item.quantity).toFixed(2)}
                  </span>
                  {/* Botões de incremento/decremento */}
                  {inc && dec && remove && (
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => dec(item.cod_barras)}>
                        -
                      </Button>
                      <span className="flex-1 text-center my-auto">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => inc(item.cod_barras)}>
                        +
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => remove(item.cod_barras)}>
                        <Trash2/>
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="bg-gray-100 shadow-inner">
        <CardContent className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">R$ {total.toFixed(2)}</span>
        </CardContent>
      </Card>
    </div>
  );
}
