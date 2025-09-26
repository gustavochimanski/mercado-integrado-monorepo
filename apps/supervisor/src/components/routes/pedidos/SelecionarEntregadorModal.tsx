"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog"
import { Button } from "@supervisor/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@supervisor/components/ui/select"
import { useEntregadores, useMutateEntregador } from "@supervisor/services/useQueryEntregadores"
import { Truck, Link, ExternalLink } from "lucide-react"
import { useToast } from "@supervisor/hooks/use-toast"

interface SelecionarEntregadorModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (entregadorId: number) => void
  pedidoId?: number
  pedidosIds?: number[] // Para seleção múltipla
  empresaId?: number 
  isMultiplo?: boolean // Indica se é seleção múltipla
  pedidoAtual?: { id: number; status: string; motoboy?: string } | null // Pedido sendo processado
  indiceAtual?: number // Índice atual no processamento
  totalPedidos?: number // Total de pedidos para processar
  onPular?: () => void // Função para pular pedido atual
}

export function SelecionarEntregadorModal({
  isOpen,
  onClose,
  onConfirm,
  pedidoId,
  pedidosIds = [],
  empresaId = 1, // Default empresa ID
  isMultiplo = false,
  pedidoAtual = null,
  indiceAtual = 0,
  totalPedidos = 0,
  onPular
}: SelecionarEntregadorModalProps) {
  const [selectedEntregador, setSelectedEntregador] = useState<string>("")
  const [isVinculando, setIsVinculando] = useState(false)
  const { toast } = useToast()
  const { data: entregadores, isLoading, refetch } = useEntregadores(isOpen)
  const { vincularEmpresa } = useMutateEntregador()

  // Limpar seleção quando muda o pedido atual
  useEffect(() => {
    if (isMultiplo && pedidoAtual) {
      setSelectedEntregador("")
    }
  }, [pedidoAtual, isMultiplo])

  const handleConfirm = async () => {
    if (selectedEntregador && selectedEntregador !== "loading" && selectedEntregador !== "no-entregadores") {
      const entregadorId = Number(selectedEntregador)
      const entregador = entregadores?.find(e => e.id === entregadorId)

      // Se o entregador não está vinculado (não tem empresas), vincula automaticamente
      if (entregador && (!entregador.empresas || entregador.empresas.length === 0)) {
        try {
          setIsVinculando(true)
          await vincularEmpresa.mutateAsync({
            entregador_id: entregadorId,
            empresa_id: empresaId
          })
          toast({
            title: "Entregador vinculado!",
            description: `${entregador.nome} foi vinculado à empresa e selecionado.`
          })
          await refetch()
        } catch (error) {
          toast({
            title: "Erro ao vincular entregador",
            description: "Não foi possível vincular o entregador. Tente novamente.",
            variant: "destructive"
          })
          setIsVinculando(false)
          return
        } finally {
          setIsVinculando(false)
        }
      }

      onConfirm(entregadorId)
      setSelectedEntregador("")
      // Não fechar o modal aqui - deixar o FooterSelecionados controlar
    }
  }

  const handleClose = () => {
    setSelectedEntregador("")
    onClose()
  }

  // Separar entregadores vinculados dos não vinculados
  const entregadoresVinculados = entregadores?.filter(e => e.empresas && e.empresas.length > 0) || []
  const entregadoresNaoVinculados = entregadores?.filter(e => !e.empresas || e.empresas.length === 0) || []
  const todosEntregadores = [...entregadoresVinculados, ...entregadoresNaoVinculados]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Selecionar Entregador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progresso para processamento individual */}
          {isMultiplo && pedidoAtual && totalPedidos > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-800">
                  Processando pedidos ({indiceAtual + 1} de {totalPedidos})
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((indiceAtual + 1) / totalPedidos) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-blue-600">
                Pedido atual: <strong>#{pedidoAtual.id}</strong>
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {isMultiplo && pedidoAtual
              ? `Para alterar o status do pedido #${pedidoAtual.id} para "Saiu para Entrega", é necessário vincular um entregador.`
              : isMultiplo
              ? `Para alterar o status de ${pedidosIds.length} pedido(s) para "Saiu para Entrega", é necessário vincular um entregador.`
              : `Para alterar o status do pedido #${pedidoId} para "Saiu para Entrega", é necessário vincular um entregador.`
            }
          </p>
          
          {/* Lista de pedidos para seleção múltipla simples */}
          {isMultiplo && !pedidoAtual && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-800 mb-2">Pedidos selecionados:</p>
              <div className="flex flex-wrap gap-1">
                {pedidosIds.map((id, index) => (
                  <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    #{id}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Entregador</label>
            <Select value={selectedEntregador} onValueChange={setSelectedEntregador}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um entregador" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Carregando...
                  </SelectItem>
                ) : todosEntregadores.length === 0 ? (
                  <SelectItem value="no-entregadores" disabled>
                    Nenhum entregador encontrado
                  </SelectItem>
                ) : (
                  <>
                    {entregadoresVinculados.length > 0 && (
                      <>
                        {entregadoresVinculados.map((entregador) => (
                          <SelectItem key={entregador.id} value={entregador.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Link className="w-4 h-4 text-green-600" />
                              <span>{entregador.nome}</span>
                              {entregador.telefone && <span className="text-muted-foreground">- {entregador.telefone}</span>}
                            </div>
                          </SelectItem>
                        ))}
                        {entregadoresNaoVinculados.length > 0 && <div className="border-t my-1" />}
                      </>
                    )}
                    {entregadoresNaoVinculados.length > 0 && (
                      <>
                        <SelectItem value="header-inativos" disabled className="font-medium text-xs text-muted-foreground">
                          Entregadores não vinculados (serão vinculados automaticamente):
                        </SelectItem>
                        {entregadoresNaoVinculados.map((entregador) => (
                          <SelectItem key={entregador.id} value={entregador.id.toString()}>
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-orange-600" />
                              <span>{entregador.nome}</span>
                              {entregador.telefone && <span className="text-muted-foreground">- {entregador.telefone}</span>}
                              <span className="text-xs text-orange-600">(vincular)</span>
                            </div>
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {isMultiplo && pedidoAtual && onPular && (
                <Button variant="outline" onClick={onPular}>
                  Pular Pedido
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedEntregador || selectedEntregador === "loading" || selectedEntregador === "no-entregadores" || selectedEntregador === "header-inativos" || isVinculando}
              >
                {isVinculando ? "Vinculando..." : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}