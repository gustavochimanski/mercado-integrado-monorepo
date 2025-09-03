"use client";

import React, { useMemo, useState } from "react";
import { Checkbox } from "@supervisor/components/ui/checkbox";
import { PedidoKanban, PedidoStatus } from "@supervisor/types/pedido";
import { KanbanColuna } from "./KanbanColuna";
import { FooterSelecionados } from "./SuspenseFooter";
import {
  useFetchPedidosAdminKanban,
  useMutatePedidoAdmin,
} from "@supervisor/services/useQueryPedidoAdmin";
import { format } from "date-fns";
import { DatePicker } from "../../shared/DatePicker";

// ---------------- Status Map ----------------
export type StatusMeta = { label: string; headerClass: string };

export const statusMap: Record<PedidoStatus, StatusMeta> = {
  P: { label: "Pendente", headerClass: "bg-yellow-500 text-white" },
  R: { label: "Em preparo", headerClass: "bg-purple-600 text-white" },
  S: {
    label: "Saiu para entrega",
    headerClass: "bg-[hsl(var(--primary))] text-white",
  },
  E: { label: "Entregue", headerClass: "bg-green-600 text-white" },
  C: { label: "Cancelado", headerClass: "bg-red-600 text-white" },
};

// ---------------- KanbanPedidos ----------------
const KanbanPedidos = () => {
  const hoje = new Date();
  const [selectedDay, setSelectedDay] = useState<Date>(hoje);

  // formatamos no padrão que o backend espera (YYYY-MM-DD)
  const selectedDate = format(selectedDay, "yyyy-MM-dd");

  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [colunasVisiveis, setColunasVisiveis] = useState<
    Record<PedidoStatus, boolean>
  >(() =>
    Object.keys(statusMap).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<PedidoStatus, boolean>
    )
  );

  const { data: pedidos = [], isLoading } =
    useFetchPedidosAdminKanban(selectedDate);
  const { atualizarStatus } = useMutatePedidoAdmin();

  // ---------------- Agrupando pedidos por status ----------------
  const pedidosPorStatus = useMemo(() => {
    const agrupados: Record<PedidoStatus, PedidoKanban[]> =
      {} as Record<PedidoStatus, PedidoKanban[]>;
    (Object.keys(statusMap) as PedidoStatus[]).forEach(
      (s) => (agrupados[s] = [])
    );
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

  const handleMoverSelecionados = (novoStatus: PedidoStatus) => {
    selecionados.forEach((id) =>
      atualizarStatus.mutate({ id, status: novoStatus })
    );
    setSelecionados(new Set());
  };

  const handleCancelarSelecionados = () => setSelecionados(new Set());

  if (isLoading) return <p>Carregando pedidos...</p>;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col p-4 space-y-4">
      {/* Filtro por Data */}

      {/* Filtro de colunas */}
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-4 items-center">
        {Object.entries(statusMap).map(([key, meta]) => (
          <label
          key={key}
          className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <Checkbox
              checked={colunasVisiveis[key as PedidoStatus]}
              onCheckedChange={() => handleToggleColuna(key as PedidoStatus)}
            />
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 text-primary">
              {meta.label}
            </span>
          </label>
        ))}
        </div>
        <DatePicker date={selectedDay} onChange={setSelectedDay} />
      </div>

      {/* Colunas do Kanban */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 h-full">
          {Object.entries(statusMap)
            .filter(([key]) => colunasVisiveis[key as PedidoStatus])
            .map(([statusKey, meta]) => (
              <KanbanColuna
                key={statusKey}
                statusMeta={meta}
                pedidos={pedidosPorStatus[statusKey as PedidoStatus] || []}
                selecionados={selecionados}
                onToggleSelecionado={toggleSelecionado}
                selectedDate={selectedDate}
              />
            ))}
        </div>
      </div>

      {/* Footer de ações */}
      {selecionados.size > 0 && (
        <FooterSelecionados
          count={selecionados.size}
          onMoverSelecionados={handleMoverSelecionados}
          onCancelar={handleCancelarSelecionados}
          visivel={selecionados.size > 0}
        />
      )}
    </div>
  );
};

export default KanbanPedidos;
