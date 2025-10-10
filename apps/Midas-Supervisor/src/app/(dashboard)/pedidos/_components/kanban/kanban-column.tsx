'use client'

import { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PEDIDO_STATUS } from '@/lib/constants/pedido-status'
import { KanbanCard } from './kanban-card'
import type { Pedido, PedidoStatus } from '@/types/pedido'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  status: PedidoStatus
  pedidos: Pedido[]
  selecionados: Set<number>
  onToggleSelecao: (id: number) => void
  onClickCard?: (pedidoId: number) => void
  onImprimirCupom?: (pedidoId: number) => void
}

/**
 * Coluna individual do Kanban
 * Representa um status específico dos pedidos
 */
export const KanbanColumn = memo(function KanbanColumn({
  status,
  pedidos,
  selecionados,
  onToggleSelecao,
  onClickCard,
  onImprimirCupom,
}: KanbanColumnProps) {
  const config = PEDIDO_STATUS[status]
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col bg-muted/30 rounded-lg h-full flex-1 min-w-0">
      {/* Header da Coluna */}
      <div
        className={cn(
          'p-4 rounded-t-lg',
          config.color,
          config.textColor
        )}
      >
        <h3 className="font-semibold">{config.label}</h3>
        <p className="text-xs opacity-90">
          {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Dropzone (Área onde solta os cards) */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-3 space-y-3 overflow-y-auto',
          isOver && 'bg-primary/10 border-2 border-primary border-dashed'
        )}
      >
        <SortableContext
          items={pedidos.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {pedidos.map((pedido) => (
            <KanbanCard
              key={pedido.id}
              pedido={pedido}
              selecionado={selecionados.has(pedido.id)}
              onToggleSelecao={onToggleSelecao}
              onClickCard={onClickCard}
              onImprimirCupom={onImprimirCupom}
            />
          ))}
        </SortableContext>

        {/* Estado Vazio */}
        {pedidos.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Nenhum pedido
          </div>
        )}
      </div>
    </div>
  )
})
