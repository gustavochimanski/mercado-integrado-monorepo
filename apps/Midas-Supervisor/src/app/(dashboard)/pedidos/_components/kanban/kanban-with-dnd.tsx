'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { KanbanCard } from './kanban-card'
import { STATUS_ORDER } from '@/lib/constants/pedido-status'
import type { Pedido, PedidoStatus } from '@/types/pedido'

interface KanbanWithDndProps {
  pedidos: Pedido[]
  pedidosLocal: Pedido[]
  handleMudancaStatus: (pedidos: Pedido[], novoStatus: PedidoStatus) => Promise<void>
  children: (props: {
    handleAvancarStatus: (pedido: Pedido, proximoStatus: PedidoStatus) => Promise<void>
  }) => ReactNode
}

/**
 * Componente wrapper que gerencia drag-and-drop do Kanban
 * Encapsula toda lógica de DnD
 */
export function KanbanWithDnd({
  pedidos,
  pedidosLocal,
  handleMudancaStatus,
  children,
}: KanbanWithDndProps) {
  const [activePedido, setActivePedido] = useState<Pedido | null>(null)
  const [isDndReady, setIsDndReady] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    setIsDndReady(true)
  }, [])

  const handleDragStart = useCallback(
    (event: DragEndEvent) => {
      const pedido = pedidos.find((p) => p.id === event.active.id)
      setActivePedido(pedido || null)
    },
    [pedidos]
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event
      setActivePedido(null)

      if (!over || active.id === over.id) return

      const novoStatus = over.id as string
      if (!STATUS_ORDER.includes(novoStatus as PedidoStatus)) {
        return
      }

      const pedidoId = Number(active.id)
      const pedido = pedidosLocal.find((p) => p.id === pedidoId)

      if (!pedido) return

      // Não faz atualização otimista aqui
      // A atualização vai acontecer no handleMudancaStatus ou via polling
      await handleMudancaStatus([pedido], novoStatus as PedidoStatus)
    },
    [pedidosLocal, handleMudancaStatus]
  )

  const handleAvancarStatus = useCallback(
    async (pedido: Pedido, proximoStatus: PedidoStatus) => {
      await handleMudancaStatus([pedido], proximoStatus)
    },
    [handleMudancaStatus]
  )

  if (!isDndReady) {
    return <>{children({ handleAvancarStatus })}</>
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children({ handleAvancarStatus })}

      <DragOverlay>
        {activePedido && (
          <KanbanCard
            pedido={activePedido}
            selecionado={false}
            onToggleSelecao={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
