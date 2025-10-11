'use client'

import { memo } from 'react'
import { KanbanColumn } from './kanban-column'
import { STATUS_ORDER } from '@/lib/constants/pedido-status'
import type { Pedido, PedidoStatus } from '@/types/pedido'

interface KanbanGridProps {
  pedidosPorStatus: Record<PedidoStatus, Pedido[]>
  selecionados: Set<number>
  onToggleSelecao: (id: number) => void
  onClickCard: (pedidoId: number) => void
  onImprimirCupom: (pedidoId: number) => void
  onAvancarStatus: (pedido: Pedido, proximoStatus: PedidoStatus) => Promise<void>
}

/**
 * Grid de colunas do Kanban
 * Componente de apresentação que renderiza todas as colunas
 */
export const KanbanGrid = memo(function KanbanGrid({
  pedidosPorStatus,
  selecionados,
  onToggleSelecao,
  onClickCard,
  onImprimirCupom,
  onAvancarStatus,
}: KanbanGridProps) {
  return (
    <div className="flex-1 min-h-0">
      <div className="flex gap-4 h-full">
        {STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            pedidos={pedidosPorStatus[status]}
            selecionados={selecionados}
            onToggleSelecao={onToggleSelecao}
            onClickCard={onClickCard}
            onImprimirCupom={onImprimirCupom}
            onAvancarStatus={onAvancarStatus}
          />
        ))}
      </div>
    </div>
  )
})
