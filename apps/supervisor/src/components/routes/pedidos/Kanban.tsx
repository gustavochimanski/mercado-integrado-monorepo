"use client";

import React, { useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@supervisor/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@supervisor/components/ui/dropdown-menu";
import { ArrowLeft, ArrowRight, CircleX, MoreVertical, Trash2 } from "lucide-react";
import { PedidoKanban, PedidoStatus } from "@supervisor/types/pedido";
import {  useFetchPedidosAdminKanban, useMutatePedidoAdmin } from "@supervisor/services/useQueryPedidoAdmin";

// ---------------- Status Map completo ----------------
type StatusMeta = { label: string; headerClass: string };
const statusMap: Record<PedidoStatus, StatusMeta> = {
  P: { label: "Pendente", headerClass: "bg-yellow-500 text-white" },
  R: { label: "Em preparo", headerClass: "bg-purple-600 text-white" },
  S: { label: "Saiu para entrega", headerClass: "bg-[hsl(var(--primary))] text-white" },
  E: { label: "Entregue", headerClass: "bg-green-600 text-white" },
  C: { label: "Cancelados", headerClass: "bg-red-600 text-white" },
};

// ---------------- PedidoCard ----------------
const PedidoCard = React.memo(
  ({
    pedido,
    onMover,
    selecionado,
    onToggleSelecionado,
    onMoverSelecionadosPara,
    temSelecionados,
  }: {
    pedido: PedidoKanban;
    onMover: (id: number, novoStatus: PedidoStatus) => void;
    selecionado: boolean;
    onToggleSelecionado: (id: number) => void;
    onMoverSelecionadosPara: (novoStatus: PedidoStatus) => void;
    temSelecionados: boolean;
  }) => {
    const statusKeys = Object.keys(statusMap) as PedidoStatus[];
    const index = statusKeys.indexOf(pedido.status);
    const anterior = statusKeys[index - 1];
    const proximo = statusKeys[index + 1];

    return (
      <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-2">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selecionado}
              onChange={() => onToggleSelecionado(pedido.id)}
              className="accent-primary"
            />
            <div>
              <p className="font-semibold text-primary text-base">#{pedido.id}</p>
              <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${statusMap[pedido.status].headerClass}`}>
                {statusMap[pedido.status].label}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-primary transition">
                <MoreVertical size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {anterior && (
                <DropdownMenuItem
                  onClick={() =>
                    temSelecionados
                      ? onMoverSelecionadosPara(anterior)
                      : onMover(pedido.id, anterior)
                  }
                >
                  <ArrowLeft size={16} className="mr-2" />
                  {statusMap[anterior].label}
                </DropdownMenuItem>
              )}
              {proximo && (
                <DropdownMenuItem
                  onClick={() =>
                    temSelecionados
                      ? onMoverSelecionadosPara(proximo)
                      : onMover(pedido.id, proximo)
                  }
                >
                  <ArrowRight size={16} className="mr-2" />
                  {statusMap[proximo].label}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onMover(pedido.id, "C")}>
                <CircleX size={16} className="mr-2" /> Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Informações do cliente */}
        <div className="text-sm text-muted-foreground flex flex-col gap-1">
          <span><strong>Cliente:</strong> {pedido.nome_cliente || "—"}</span>
          <span><strong>Telefone:</strong> {pedido.telefone_cliente || "—"}</span>
          {pedido.endereco_cliente && (
            <span ><strong>Endereço:</strong> {pedido.endereco_cliente}</span>
          )}
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


// ---------------- KanbanColuna ----------------
const KanbanColuna = React.memo(
  ({
    statusMeta,
    pedidos,
    onMover,
    selecionados,
    onToggleSelecionado,
    onMoverSelecionadosPara,
  }: {
    statusMeta: StatusMeta;
    pedidos: PedidoKanban[];
    onMover: (id: number, novoStatus: PedidoStatus) => void;
    selecionados: Set<number>;
    onToggleSelecionado: (id: number) => void;
    onMoverSelecionadosPara: (novoStatus: PedidoStatus) => void;
  }) => (
    <div className="flex flex-col h-full flex-1 bg-muted rounded shadow overflow-hidden min-w-[250px]">
      <h2 className={`text-center font-bold p-2 border-b ${statusMeta.headerClass}`}>
        {statusMeta.label}
      </h2>
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-2">
          {pedidos.length > 0 ? (
            pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                onMover={onMover}
                selecionado={selecionados.has(pedido.id)}
                onToggleSelecionado={onToggleSelecionado}
                onMoverSelecionadosPara={onMoverSelecionadosPara}
                temSelecionados={selecionados.size > 0}
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

// ---------------- KanbanPedidos principal ----------------
const KanbanPedidos = () => {
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [colunasVisiveis, setColunasVisiveis] = useState<Record<PedidoStatus, boolean>>(() =>
    Object.keys(statusMap).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<PedidoStatus, boolean>)
  );

  const { data: pedidos = [], isLoading } = useFetchPedidosAdminKanban();
  const { atualizarStatus } = useMutatePedidoAdmin();

  // ---------------- Agrupando pedidos por status ----------------
  const pedidosPorStatus = useMemo(() => {
    const agrupados: Record<PedidoStatus, PedidoKanban[]> = {} as Record<PedidoStatus, PedidoKanban[]>;
    (Object.keys(statusMap) as PedidoStatus[]).forEach((s) => (agrupados[s] = []));
    pedidos.forEach((pedido) => {
      agrupados[pedido.status]?.push(pedido);
    });
    return agrupados;
  }, [pedidos]);

  const toggleSelecionado = (id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const handleToggleColuna = (key: PedidoStatus) => {
    setColunasVisiveis((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMoverPedido = (id: number, novoStatus: PedidoStatus) => {
    atualizarStatus.mutate({ id, status: novoStatus });
  };

  const handleMoverSelecionados = (novoStatus: PedidoStatus) => {
    selecionados.forEach((id) => atualizarStatus.mutate({ id, status: novoStatus }));
    setSelecionados(new Set());
  };

  if (isLoading) return <p>Carregando pedidos...</p>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {Object.entries(statusMap).map(([key, meta]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={colunasVisiveis[key as PedidoStatus]}
              onChange={() => handleToggleColuna(key as PedidoStatus)}
              className="accent-blue-500"
            />
            {meta.label}
          </label>
        ))}

        <select
          className="border rounded px-2 py-1 text-sm"
          value=""
          onChange={(e) => {
            if (!e.target.value) return;
            handleMoverSelecionados(e.target.value as PedidoStatus);
          }}
        >
          <option value="">Mover selecionados para...</option>
          {Object.entries(statusMap).map(([key, meta]) => (
            <option key={key} value={key}>
              {meta.label}
            </option>
          ))}
        </select>

        {selecionados.size > 0 && (
          <span className="text-sm text-muted-foreground">{selecionados.size} selecionado(s)</span>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {Object.entries(statusMap)
            .filter(([key]) => colunasVisiveis[key as PedidoStatus])
            .map(([statusKey, meta]) => (
              <KanbanColuna
                key={statusKey}
                statusMeta={meta}
                pedidos={pedidosPorStatus[statusKey as PedidoStatus] || []}
                onMover={handleMoverPedido}
                selecionados={selecionados}
                onToggleSelecionado={toggleSelecionado}
                onMoverSelecionadosPara={handleMoverSelecionados}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanPedidos;
