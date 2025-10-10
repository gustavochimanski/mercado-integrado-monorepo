'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PEDIDO_STATUS, STATUS_ORDER } from '@/lib/constants/pedido-status'
import { atualizarStatusEmLote } from '@/actions/pedidos/atualizar-status-lote'
import type { PedidoStatus } from '@/types/pedido'
import { CheckCircle2, X, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useSidebar } from '@/contexts/sidebar-context'

interface FooterSelecaoLoteProps {
  pedidosSelecionados: number[]
  onLimparSelecao: () => void
}

/**
 * Footer fixo que aparece quando há pedidos selecionados
 * Permite mover múltiplos pedidos para um novo status de uma vez
 */
export const FooterSelecaoLote = memo(function FooterSelecaoLote({
  pedidosSelecionados,
  onLimparSelecao,
}: FooterSelecaoLoteProps) {
  const [novoStatus, setNovoStatus] = useState<PedidoStatus | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const { isCollapsed } = useSidebar()

  // Não mostra o footer se não houver seleção
  if (pedidosSelecionados.length === 0) {
    return null
  }

  /**
   * Atualiza o status de todos os pedidos selecionados
   */
  const handleAtualizarEmLote = async () => {
    if (!novoStatus) {
      toast.error('Selecione um status primeiro')
      return
    }

    setIsLoading(true)

    try {
      const result = await atualizarStatusEmLote(pedidosSelecionados, novoStatus)

      if (result.success) {
        toast.success(result.message || 'Pedidos atualizados com sucesso!')
        onLimparSelecao()
        setNovoStatus('')
      } else {
        toast.error(result.error || 'Erro ao atualizar pedidos')
      }
    } catch (error) {
      toast.error('Erro ao atualizar pedidos')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`fixed bottom-0 right-0 z-30 bg-card border-t shadow-lg transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Contador de selecionados */}
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">
              {pedidosSelecionados.length} pedido
              {pedidosSelecionados.length > 1 ? 's' : ''} selecionado
              {pedidosSelecionados.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-3">
            {/* Select de Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Mover para:
              </span>
              <Select
                value={novoStatus}
                onValueChange={(value) => setNovoStatus(value as PedidoStatus)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${PEDIDO_STATUS[status].color}`}
                        />
                        {PEDIDO_STATUS[status].label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botão Aplicar */}
            <Button
              onClick={handleAtualizarEmLote}
              disabled={!novoStatus || isLoading}
              size="sm"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              {isLoading ? 'Atualizando...' : 'Aplicar'}
            </Button>

            {/* Botão Cancelar */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLimparSelecao}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})
