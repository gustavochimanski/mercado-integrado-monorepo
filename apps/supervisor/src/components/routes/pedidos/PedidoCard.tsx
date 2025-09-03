import { PedidoKanban } from "@supervisor/types/pedido";
import React from "react";
import { statusMap } from "./Kanban";
import TempoPedidoBadge from "./TempoPedidoBasge";
import { Checkbox } from "@supervisor/components/ui/checkbox";
import { isToday, parseISO } from "date-fns";

export const PedidoCard = React.memo(
  ({
    pedido,
    selecionado,
    onToggleSelecionado,
    selectedDate, // <- adicionamos aqui
  }: {
    pedido: PedidoKanban;
    selecionado: boolean;
    onToggleSelecionado: (id: number) => void;
    selectedDate: string; // formato "yyyy-MM-dd"
  }) => {
    const mostrarTempoBadge =
      pedido.status !== "C" &&
      pedido.status !== "E" &&
      isToday(parseISO(selectedDate));

    return (
      <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selecionado}
            onCheckedChange={() => onToggleSelecionado(pedido.id)}
          />
          <div>
            <p className="font-semibold text-primary text-base">#{pedido.id}</p>
            <span
              className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${statusMap[pedido.status].headerClass}`}
            >
              {statusMap[pedido.status].label}
            </span>
          </div>
          <div className="flex mt-auto gap-2">
            {mostrarTempoBadge && (
              <TempoPedidoBadge
                dataCriacao={pedido.data_criacao}
                limiteMinutos={30}
              />
            )}
          </div>
        </div>

        {/* Informações do cliente */}
        <div className="text-sm text-muted-foreground flex flex-col gap-1">
          <span>
            <strong>Cliente:</strong> {pedido.nome_cliente || "—"}
          </span>
          <span>
            <strong>Telefone:</strong> {pedido.telefone_cliente || "—"}
          </span>
          {pedido.endereco_cliente && (
            <span>
              <strong>Endereço:</strong> {pedido.endereco_cliente}
            </span>
          )}
          <span>
            <strong>Meio de Pagamento:</strong>{" "}
            {pedido.meio_pagamento_descricao || "—"}
          </span>
          <span>
            <strong>Observação Geral:</strong> {pedido.observacao_geral || "—"}
          </span>
        </div>

        {/* Valor total */}
        <div className="mt-1 flex justify-end font-bold text-foreground">
          R$ {pedido.valor_total.toFixed(2)}
        </div>
      </div>
    );
  }
);

PedidoCard.displayName = "PedidoCard";
