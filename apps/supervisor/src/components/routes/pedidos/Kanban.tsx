"use client";

import React, { useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@supervisor/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@supervisor/components/ui/dropdown-menu";
import { ArrowLeft, ArrowRight, MoreVertical } from "lucide-react";

/** Agora o mapa traz label + headerClass (cor do cabeçalho) */
type StatusMeta = { label: string; headerClass: string };

const statusMap: Record<string, { label: string; headerClass: string }> = {
  P: { label: "Pendente", headerClass: "bg-[hsl(var(--chart-red))] text-white" },
  E: { label: "Em preparo", headerClass: "bg-[hsl(var(--chart-yellow))] text-white" },
  S: { label: "Saiu para entrega", headerClass: "bg-[hsl(var(--primary))] text-white" },
  F: { label: "Finalizado", headerClass: "bg-[hsl(var(--chart-green))] text-white" },
};


const pedidosIniciais = [
  { id: "001", cliente: "João", status: "P", valor: 28.9 },
  { id: "002", cliente: "Maria", status: "P", valor: 42.5 },
  { id: "003", cliente: "Carlos", status: "E", valor: 19.0 },
  { id: "004", cliente: "Ana", status: "P", valor: 39.9 },
  { id: "005", cliente: "Paula", status: "P", valor: 51.2 },
  { id: "006", cliente: "João", status: "P", valor: 28.9 },
  { id: "007", cliente: "João", status: "P", valor: 28.9 },
  { id: "008", cliente: "João", status: "P", valor: 28.9 },
  { id: "009", cliente: "João", status: "P", valor: 28.9 },
  { id: "010", cliente: "Carlos", status: "E", valor: 19.0 },
];

const PedidoCard = React.memo(
  ({
    pedido,
    onMover,
    selecionado,
    onToggleSelecionado,
    onMoverSelecionadosPara,
    temSelecionados,
  }: {
    pedido: typeof pedidosIniciais[0];
    onMover: (id: string, novoStatus: string) => void;
    selecionado: boolean;
    onToggleSelecionado: (id: string) => void;
    onMoverSelecionadosPara: (novoStatus: string) => void;
    temSelecionados: boolean;
  }) => {
    const statusKeys = Object.keys(statusMap);
    const index = statusKeys.indexOf(pedido.status);
    const anterior = statusKeys[index - 1];
    const proximo = statusKeys[index + 1];

    return (
      <div className="bg-background border rounded-xl p-3 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selecionado}
              onChange={() => onToggleSelecionado(pedido.id)}
              className="accent-primary"
            />
            <div className="text-sm">
              <p className="font-semibold text-primary">#{pedido.id}</p>
              <p className="text-muted-foreground text-xs">
                Cliente: {pedido.cliente}
              </p>
              <p className="text-green-600 font-bold text-sm">
                R$ {pedido.valor.toFixed(2)}
              </p>
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
                  Mover para {statusMap[anterior].label}
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
                  Mover para {statusMap[proximo].label}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);
PedidoCard.displayName = "PedidoCard";

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
    pedidos: typeof pedidosIniciais;
    onMover: (id: string, novoStatus: string) => void;
    selecionados: Set<string>;
    onToggleSelecionado: (id: string) => void;
    onMoverSelecionadosPara: (novoStatus: string) => void;
  }) => (
    <div className="flex flex-col h-full flex-1 bg-muted rounded shadow overflow-hidden min-w-[250px]">
      {/* Cabeçalho colorido conforme o status */}
      <h2
        className={`text-center font-bold p-2 border-b ${statusMeta.headerClass}`}
      >
        {statusMeta.label}
      </h2>
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-2">
          {pedidos.length > 0 ? (
            pedidos.map((pedido, i) => (
              <PedidoCard
                key={`${pedido.id}-${i}`}
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
      </ScrollArea>
    </div>
  )
);
KanbanColuna.displayName = "KanbanColuna";

const KanbanPedidos = () => {
  const [pedidos, setPedidos] = useState(pedidosIniciais);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const toggleSelecionado = (id: string) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      novo.has(id) ? novo.delete(id) : novo.add(id);
      return novo;
    });
  };

  const [colunasVisiveis, setColunasVisiveis] = useState<Record<string, boolean>>(
    () => {
      const visiveis: Record<string, boolean> = {};
      Object.keys(statusMap).forEach((key) => {
        visiveis[key] = true;
      });
      return visiveis;
    }
  );

  const pedidosPorStatus = useMemo(() => {
    const agrupados: Record<string, typeof pedidosIniciais> = {};
    for (const key of Object.keys(statusMap)) {
      agrupados[key] = [];
    }
    for (const pedido of pedidos) {
      agrupados[pedido.status]?.push(pedido);
    }
    return agrupados;
  }, [pedidos]);

  const handleToggleColuna = (key: string) => {
    setColunasVisiveis((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleMoverPedido = (id: string, novoStatus: string) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido.id === id ? { ...pedido, status: novoStatus } : pedido
      )
    );
  };

  const handleMoverSelecionados = (novoStatus: string) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        selecionados.has(pedido.id) ? { ...pedido, status: novoStatus } : pedido
      )
    );
    setSelecionados(new Set());
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {Object.entries(statusMap).map(([key, meta]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={colunasVisiveis[key]}
              onChange={() => handleToggleColuna(key)}
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
            handleMoverSelecionados(e.target.value);
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
          <span className="text-sm text-muted-foreground">
            {selecionados.size} selecionado(s)
          </span>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {Object.entries(statusMap)
            .filter(([key]) => colunasVisiveis[key])
            .map(([statusKey, meta]) => (
              <KanbanColuna
                key={statusKey}
                statusMeta={meta}
                pedidos={pedidosPorStatus[statusKey] || []}
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
