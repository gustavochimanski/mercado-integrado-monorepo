'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Bike } from 'lucide-react'

interface ModalDesvincularEntregadorProps {
  isOpen: boolean
  onClose: () => void
  onConfirmarDesvincular: () => Promise<void>
  onManterVinculo: () => Promise<void>
  pedidosComEntregador: Array<{
    pedidoId: number
    entregadorNome: string
  }>
  isLoading?: boolean
}

/**
 * Modal para perguntar se deseja desvincular entregador ao voltar status
 * (Ex: de "saiu_para_entrega" para "preparando")
 */
export function ModalDesvincularEntregador({
  isOpen,
  onClose,
  onConfirmarDesvincular,
  onManterVinculo,
  pedidosComEntregador,
  isLoading = false,
}: ModalDesvincularEntregadorProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            Desvincular Entregador?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              {pedidosComEntregador.length === 1
                ? 'Este pedido tem um entregador vinculado:'
                : 'Estes pedidos têm entregadores vinculados:'}
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {pedidosComEntregador.map((p) => (
                <li key={p.pedidoId}>
                  Pedido #{p.pedidoId} - <span className="font-semibold">{p.entregadorNome}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm">
              Deseja desvincular {pedidosComEntregador.length === 1 ? 'o entregador' : 'os entregadores'} ao voltar o status do pedido?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar operação
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onManterVinculo()
            }}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Manter vinculado
          </AlertDialogAction>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirmarDesvincular()
            }}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isLoading ? 'Processando...' : 'Sim, desvincular'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
