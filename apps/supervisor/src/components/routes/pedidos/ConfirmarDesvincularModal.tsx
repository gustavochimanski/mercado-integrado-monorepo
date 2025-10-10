"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog"
import { Button } from "@supervisor/components/ui/button"
import { AlertTriangle, User, Truck } from "lucide-react"

interface ConfirmarDesvincularModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  pedidosIds: number[]
  isMultiplo?: boolean
  pedidoAtual?: { id: number; status: string; motoboy?: string } | null
  indiceAtual?: number
  totalPedidos?: number
}

export function ConfirmarDesvincularModal({
  isOpen,
  onClose,
  onConfirm,
  pedidosIds,
  isMultiplo = false,
  pedidoAtual = null,
  indiceAtual = 0,
  totalPedidos = 0
}: ConfirmarDesvincularModalProps) {
  const [isProcessando, setIsProcessando] = useState(false)

  const handleConfirm = async () => {
    setIsProcessando(true)
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error('Erro ao desvincular entregador:', error)
    } finally {
      setIsProcessando(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Desvincular Entregador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progresso para processamento individual */}
          {isMultiplo && pedidoAtual && totalPedidos > 1 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-orange-800">
                  Processando pedidos ({indiceAtual + 1} de {totalPedidos})
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-orange-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((indiceAtual + 1) / totalPedidos) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-orange-600">
                Pedido atual: <strong>#{pedidoAtual.id}</strong>
              </p>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-orange-800">
                  {isMultiplo && pedidoAtual
                    ? `Deseja desvincular o entregador do pedido #${pedidoAtual.id}?`
                    : isMultiplo
                    ? `Deseja desvincular os entregadores de ${pedidosIds.length} pedido(s)?`
                    : `Deseja desvincular o entregador do pedido #${pedidosIds[0]}?`
                  }
                </p>
                <p className="text-xs text-orange-600">
                  Esta ação irá remover a vinculação do entregador e alterar o status do pedido.
                </p>
              </div>
            </div>
          </div>

          {/* Lista de pedidos para seleção múltipla simples */}
          {isMultiplo && !pedidoAtual && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800 mb-2">Pedidos selecionados:</p>
              <div className="flex flex-wrap gap-1">
                {pedidosIds.map((id) => (
                  <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    #{id}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose} disabled={isProcessando}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessando}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isProcessando ? "Processando..." : "Sim, Desvincular"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
