'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { listarEntregadores } from '@/actions/entregadores/listar-entregadores'
import type { Entregador } from '@/types/entregador'
import { Bike, AlertCircle, User, Phone, CarFront } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalSelecionarEntregadorProps {
  isOpen: boolean
  onClose: () => void
  onConfirmar: (entregadorId: number) => Promise<void>
  pedidosComEntregador?: Array<{
    pedidoId: number
    entregadorNome: string
  }>
  empresaId?: number
  todosPedidos?: number[] // IDs de todos os pedidos sendo vinculados
}

/**
 * Modal para selecionar entregador ao mover pedido para status que requer entregador
 * Mostra alerta se algum pedido já tem entregador vinculado
 */
export function ModalSelecionarEntregador({
  isOpen,
  onClose,
  onConfirmar,
  pedidosComEntregador = [],
  empresaId,
  todosPedidos = [],
}: ModalSelecionarEntregadorProps) {
  const [entregadores, setEntregadores] = useState<Entregador[]>([])
  const [entregadorSelecionado, setEntregadorSelecionado] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingEntregadores, setIsLoadingEntregadores] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscarEntregadoresDisponiveis = useCallback(async () => {
    setIsLoadingEntregadores(true)
    setErro(null)

    try {
      const resultado = await listarEntregadores()

      if (resultado.success && resultado.data) {
        // Se empresaId foi fornecido, filtra apenas entregadores dessa empresa
        const entregadoresFiltrados = empresaId
          ? resultado.data.filter((e) =>
              e.empresas.some((emp) => emp.id === empresaId)
            )
          : resultado.data

        if (entregadoresFiltrados.length === 0) {
          setErro('Nenhum entregador disponível para esta empresa')
        }

        setEntregadores(entregadoresFiltrados)
      } else {
        setErro(resultado.error || 'Erro ao buscar entregadores')
      }
    } catch (error) {
      console.error('Erro ao buscar entregadores:', error)
      setErro('Erro ao buscar entregadores')
    } finally {
      setIsLoadingEntregadores(false)
    }
  }, [empresaId])

  // Buscar entregadores quando o modal abre
  useEffect(() => {
    if (isOpen) {
      buscarEntregadoresDisponiveis()
    } else {
      // Resetar estado quando fechar
      setEntregadorSelecionado('')
      setErro(null)
    }
  }, [isOpen, buscarEntregadoresDisponiveis])

  const handleConfirmar = async () => {
    if (!entregadorSelecionado) {
      setErro('Selecione um entregador')
      return
    }

    setIsLoading(true)
    setErro(null)

    try {
      await onConfirmar(Number(entregadorSelecionado))
      onClose()
    } catch (error) {
      console.error('Erro ao vincular entregador:', error)
      setErro('Erro ao vincular entregador')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Bike className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Selecionar Entregador</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {todosPedidos.length > 0 ? (
                  <>
                    Vinculando {todosPedidos.length === 1 ? 'pedido' : 'pedidos'}:{' '}
                    <span className="font-semibold text-primary">
                      #{todosPedidos.join(', #')}
                    </span>
                  </>
                ) : (
                  'Escolha o entregador responsável pela entrega deste(s) pedido(s)'
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Alerta se houver pedidos com entregador já vinculado */}
          {pedidosComEntregador.length > 0 && (
            <Alert variant="default" className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-2 text-orange-700 dark:text-orange-400">
                  Atenção: Pedidos com entregador vinculado
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-orange-600 dark:text-orange-300">
                  {pedidosComEntregador.map((p) => (
                    <li key={p.pedidoId}>
                      Pedido #{p.pedidoId} - {p.entregadorNome}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-orange-600 dark:text-orange-300">
                  Ao selecionar um novo entregador, o vínculo anterior será substituído.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Select de Entregadores */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Entregador
            </label>

            {isLoadingEntregadores ? (
              <div className="flex flex-col items-center justify-center p-12 gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                <p className="text-sm text-muted-foreground">Carregando entregadores...</p>
              </div>
            ) : entregadores.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 gap-2 border-2 border-dashed rounded-lg">
                <Bike className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhum entregador disponível
                </p>
              </div>
            ) : (
              <Select
                value={entregadorSelecionado}
                onValueChange={setEntregadorSelecionado}
                disabled={entregadores.length === 0}
              >
                <SelectTrigger className="h-14 w-full">
                  <SelectValue placeholder="Selecione o entregador" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {entregadores.map((entregador) => (
                    <SelectItem
                      key={entregador.id}
                      value={entregador.id.toString()}
                      className="cursor-pointer h-12"
                    >
                      <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4 text-primary" />
                        <span className="font-medium">{entregador.nome}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!entregadorSelecionado || isLoading || isLoadingEntregadores}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Vinculando...
              </>
            ) : (
              'Confirmar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
