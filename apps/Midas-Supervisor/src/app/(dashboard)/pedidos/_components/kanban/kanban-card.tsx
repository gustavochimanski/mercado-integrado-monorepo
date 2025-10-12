'use client'

import { memo, useTransition } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Checkbox } from '@/components/ui/checkbox'
import { TempoPedidoBadge } from '@/components/pedidos/tempo-pedido-badge'
import { Eye, Phone, MapPin, Bike, Printer, ChevronRight } from 'lucide-react'
import { atualizarStatusPedido } from '@/actions/pedidos/atualizar-status'
import { STATUS_ORDER } from '@/lib/constants/pedido-status'
import { toast } from 'sonner'
import type { Pedido, PedidoStatus } from '@/types/pedido'

interface KanbanCardProps {
  pedido: Pedido
  selecionado: boolean
  onToggleSelecao: (id: number) => void
  onClickCard?: (pedidoId: number) => void
  onImprimirCupom?: (pedidoId: number) => void
  onAvancarStatus?: (pedido: Pedido, proximoStatus: PedidoStatus) => Promise<void>
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
  onImprimirCupom,
  onAvancarStatus,
}: KanbanCardProps) {
  const [isPending, startTransition] = useTransition()

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

  // Determina o próximo status baseado no STATUS_ORDER
  const getProximoStatus = (): PedidoStatus | null => {
    const currentIndex = STATUS_ORDER.indexOf(pedido.status)
    // Se não encontrar ou for o último, não tem próximo
    if (currentIndex === -1 || currentIndex === STATUS_ORDER.length - 1) {
      return null
    }
    return STATUS_ORDER[currentIndex + 1]
  }

  // Handler para avançar status
  const handleProximoStatus = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    const proximoStatus = getProximoStatus()
    if (!proximoStatus) {
      toast.error('Pedido já está no status final')
      return
    }

    startTransition(async () => {
      // Se tem callback de avançar status (para lidar com entregador), usa ele
      if (onAvancarStatus) {
        await onAvancarStatus(pedido, proximoStatus)
      } else {
        // Senão, usa a lógica padrão
        const result = await atualizarStatusPedido(pedido.id, proximoStatus)

        if (result.success) {
          toast.success('Status atualizado com sucesso!')
        } else {
          toast.error(result.error || 'Erro ao atualizar status')
        }
      }
    })
  }

  const proximoStatus = getProximoStatus()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
    >
      {/* Header: Checkbox + Tempo */}
      <div className="flex items-start justify-between mb-3">
        <Checkbox
          checked={selecionado}
          onCheckedChange={() => onToggleSelecao(pedido.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 h-4.5 w-4.5"
        />
        <TempoPedidoBadge dataCriacao={pedido.data_pedido} limiteMinutos={30} />
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
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-red-500" />
            {pedido.telefone_cliente}
          </p>
          <p className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="h-3.5 w-3.5 text-red-500" />
            {pedido.endereco.toString()}
          </p>
          {pedido.entregador_nome && (
            <p className="flex items-center gap-1.5">
              <Bike className="h-3.5 w-3.5 text-red-500" />
              {pedido.entregador_nome}
            </p>
          )}
        </div>

        {/* Valor Total e Ações */}
        <div className="pt-3 border-t flex items-center justify-between">
          <p className="text-sm font-bold text-primary">
            R$ {pedido.valor_total.toFixed(2)}
          </p>
          <div className="flex items-center gap-1">
            <button
              data-action-button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onClickCard?.(pedido.id)
              }}
              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="Ver detalhes"
            >
              <Eye className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
            <button
              data-action-button
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onImprimirCupom?.(pedido.id)
              }}
              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="Imprimir cupom"
            >
              <Printer className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            </button>
            {proximoStatus && (
              <button
                data-action-button
                onClick={handleProximoStatus}
                disabled={isPending}
                className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={`Avançar para ${proximoStatus}`}
              >
                <ChevronRight className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
