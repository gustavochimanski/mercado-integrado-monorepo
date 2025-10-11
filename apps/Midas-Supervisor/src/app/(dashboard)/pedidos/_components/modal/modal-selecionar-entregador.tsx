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
import { Bike, AlertCircle } from 'lucide-react'

interface ModalSelecionarEntregadorProps {
  isOpen: boolean
  onClose: () => void
  onConfirmar: (entregadorId: number) => Promise<void>
  pedidosComEntregador?: Array<{
    pedidoId: number
    entregadorNome: string
  }>
  empresaId?: number
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5 text-primary" />
            Selecionar Entregador
          </DialogTitle>
          <DialogDescription>
            Escolha o entregador responsável pela entrega deste(s) pedido(s)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Alerta se houver pedidos com entregador já vinculado */}
          {pedidosComEntregador.length > 0 && (
            <Alert variant="default" className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm">
                <p className="font-semibold mb-2">Atenção: Pedidos com entregador vinculado</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {pedidosComEntregador.map((p) => (
                    <li key={p.pedidoId}>
                      Pedido #{p.pedidoId} - {p.entregadorNome}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs">
                  Ao selecionar um novo entregador, o vínculo anterior será substituído.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Select de Entregador */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Entregador</label>
            {isLoadingEntregadores ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <Select
                value={entregadorSelecionado}
                onValueChange={setEntregadorSelecionado}
                disabled={entregadores.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o entregador" />
                </SelectTrigger>
                <SelectContent>
                  {entregadores.map((entregador) => (
                    <SelectItem key={entregador.id} value={entregador.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{entregador.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {entregador.telefone} • {entregador.veiculo_tipo} - {entregador.placa}
                        </span>
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!entregadorSelecionado || isLoading || isLoadingEntregadores}
          >
            {isLoading ? 'Vinculando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
