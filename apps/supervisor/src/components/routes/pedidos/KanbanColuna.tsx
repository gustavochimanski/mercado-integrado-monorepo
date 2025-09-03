import React from "react";
import { StatusMeta } from "./Kanban";
import { PedidoKanban } from "@supervisor/types/pedido";
import { PedidoCard } from "./PedidoCard";
import { ScrollArea, ScrollBar } from "@supervisor/components/ui/scroll-area";

// ---------------- KanbanColuna ----------------
export const KanbanColuna = React.memo(
  ({
    statusMeta,
    pedidos,
    selecionados,
    onToggleSelecionado,
    selectedDate, // <- nova prop
  }: {
    statusMeta: StatusMeta;
    pedidos: PedidoKanban[];
    selecionados: Set<number>;
    onToggleSelecionado: (id: number) => void;
    selectedDate: string; // <- formato "yyyy-MM-dd"
  }) => (
    <div className="flex flex-col h-full flex-1 bg-muted rounded shadow overflow-hidden min-w-[250px]">
      <h2
        className={`text-center font-bold p-2 border-b ${statusMeta.headerClass}`}
      >
        {statusMeta.label}
      </h2>
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-2">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                selecionado={selecionados.has(pedido.id)}
                onToggleSelecionado={onToggleSelecionado}
                selectedDate={selectedDate} // <- passa aqui
              />
            ))
          ) : (
            <p className="text-sm text-center text-gray-500">Sem pedidos</p>
          )}
        </div>
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
);

KanbanColuna.displayName = "KanbanColuna";
