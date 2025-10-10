'use client'

import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from '@/components/ui/checkbox'
import { StatusBadge } from '@/components/pedidos/status-badge'
import { Eye } from 'lucide-react'
import type { Pedido } from '@/types/pedido'

interface KanbanCardProps {
  pedido: Pedido
  selecionado: boolean
  onToggleSelecao: (id: number) => void
  onClickCard?: (pedidoId: number) => void
}

/**
 * Card individual de pedido no Kanban
 * Suporta drag-and-drop e seleção múltipla
 */
export const KanbanCard = memo(function KanbanCard({
  pedido,
  selecionado,
  onToggleSelecao,
  onClickCard,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pedido.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Header: Checkbox + Status */}
      <div className="flex items-start justify-between mb-3">
        <Checkbox
          checked={selecionado}
          onCheckedChange={() => onToggleSelecao(pedido.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />
        <StatusBadge status={pedido.status} />
      </div>

      {/* Dados do Pedido */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Pedido #{pedido.id}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{pedido.nome_cliente}</p>
        </div>

        <div className="text-xs text-muted-foreground space-y-1.5">
          <p className="flex items-center gap-1">
            📞 {pedido.telefone_cliente}
          </p>
          <p className="flex items-center gap-1 line-clamp-1">
            📍 {pedido.endereco}
          </p>
          {pedido.entregador_nome && (
            <p className="flex items-center gap-1">
              🏍️ {pedido.entregador_nome}
            </p>
          )}
        </div>

        {/* Valor Total */}
        <div className="pt-3 border-t flex items-center justify-between">
          <p className="text-sm font-bold text-primary">
            R$ {pedido.valor_total.toFixed(2)}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClickCard?.(pedido.id)
            }}
            className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    </div>
  )
})
