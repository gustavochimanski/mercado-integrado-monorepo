"use client"

import { useState } from "react"
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
  pedidoId: number
  empresaId?: number 
}

export function SelecionarEntregadorModal({
  isOpen,
  onClose,
  onConfirm,
  pedidoId,
  empresaId = 1 // Default empresa ID
}: SelecionarEntregadorModalProps) {
  const [selectedEntregador, setSelectedEntregador] = useState<string>("")
  const [isVinculando, setIsVinculando] = useState(false)
  const { toast } = useToast()
  const { data: entregadores, isLoading, refetch } = useEntregadores(isOpen)
  const { vincularEmpresa } = useMutateEntregador()

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
      onClose()
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
          <p className="text-sm text-muted-foreground">
            Para alterar o status do pedido #{pedidoId} para &quot;Saiu para Entrega&quot;, é necessário vincular um entregador.
          </p>

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

          <div className="flex justify-end gap-2 pt-4">
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
      </DialogContent>
    </Dialog>
  )
}