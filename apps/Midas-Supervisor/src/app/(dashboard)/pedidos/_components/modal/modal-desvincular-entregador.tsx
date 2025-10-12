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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bike, AlertTriangle, Package } from 'lucide-react'

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
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3">
              <Bike className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-xl">
                Desvincular Entregador?
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <AlertDialogDescription className="text-base">
            {pedidosComEntregador.length === 1
              ? 'Este pedido tem um entregador vinculado:'
              : `Estes ${pedidosComEntregador.length} pedidos têm entregadores vinculados:`}
          </AlertDialogDescription>

          {/* Lista de pedidos com entregadores */}
          <div className="rounded-lg border bg-muted/50 p-4">
            {pedidosComEntregador.length <= 5 ? (
              // Modo detalhado: até 5 pedidos
              <div className="space-y-2">
                {pedidosComEntregador.map((p) => (
                  <div
                    key={p.pedidoId}
                    className="flex items-center gap-3 rounded-md bg-background p-3 shadow-sm"
                  >
                    <Package className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        Pedido #{p.pedidoId}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Bike className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground truncate">
                          {p.entregadorNome}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Modo compacto: mais de 5 pedidos (com scroll)
              <div className="max-h-[240px] overflow-y-auto pr-2 space-y-1.5">
                {pedidosComEntregador.map((p) => (
                  <div
                    key={p.pedidoId}
                    className="flex items-center gap-2 rounded-md bg-background p-2 border"
                  >
                    <Package className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-medium">#{p.pedidoId}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <Bike className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">
                        {p.entregadorNome}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Alerta de confirmação */}
          <Alert variant="default" className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-sm text-orange-800 dark:text-orange-300">
              {pedidosComEntregador.length === 1 ? (
                'Deseja desvincular o entregador ao voltar o status do pedido?'
              ) : (
                <>
                  Deseja desvincular os entregadores de <strong>{pedidosComEntregador.length} pedidos</strong> ao voltar o status?
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isLoading} className="sm:flex-1">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onManterVinculo()
            }}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 sm:flex-1"
          >
            Manter vinculado
          </AlertDialogAction>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              await onConfirmarDesvincular()
            }}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 sm:flex-1"
          >
            {isLoading ? 'Processando...' : 'Sim, desvincular'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
