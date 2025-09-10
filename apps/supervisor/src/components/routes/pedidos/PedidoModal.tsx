"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Badge } from "../../ui/badge"
import { Edit, Save, X, Phone, MapPin, CreditCard, Clock } from "lucide-react"
import { useUpdatePedido } from "../../../services/useQueryPedidoAdmin"
import type { PedidoKanban } from "../../../types/pedido"

interface PedidoModalProps {
  pedido: PedidoKanban | null
  isOpen: boolean
  onClose: () => void
}

export const PedidoModal: React.FC<PedidoModalProps> = ({ pedido, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any>({})
  
  const updatePedido = useUpdatePedido()

  const canEdit = pedido?.status === "P" || pedido?.status === "R"

  const getStatusText = (status: string) => {
    switch (status) {
      case "P":
        return "Pendente"
      case "R":
        return "Em Preparo"
      case "S":
        return "Saiu para Entrega"
      case "E":
        return "Entregue"
      case "C":
        return "Cancelado"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "P":
        return "destructive"
      case "R":
        return "default"
      case "S":
        return "secondary"
      case "E":
        return "default"
      case "C":
        return "destructive"
      default:
        return "default"
    }
  }

  useEffect(() => {

    console.log(pedido)
    if (pedido) {
      console.log("[v0] Usando dados do pedido:", pedido)

      setFormData({
        nome_cliente: (pedido as any).nome_cliente || "",
        telefone_cliente: (pedido as any).telefone_cliente || "",
        endereco_cliente: (pedido as any).endereco_cliente || "",
        observacao_geral: (pedido as any).observacao_geral || "",
        meio_pagamento_descricao: (pedido as any).meio_pagamento_descricao || "",
      })
    }
  }, [pedido])

  const handleSave = async () => {
    if (!pedido) return

    try {
      await updatePedido.mutateAsync({
        pedidoId: pedido.id,
        data: formData,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("[v0] Erro ao atualizar pedido:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (pedido) {
      setFormData({
        nome_cliente: (pedido as any).nome_cliente || "",
        telefone_cliente: (pedido as any).telefone_cliente || "",
        endereco_cliente: (pedido as any).endereco_cliente || "",
        observacao_geral: (pedido as any).observacao_geral || "",
        meio_pagamento_descricao: (pedido as any).meio_pagamento_descricao || "",
      })
    }
  }

  if (!pedido) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold">Pedido #{pedido.id}</DialogTitle>
              <Badge variant={getStatusVariant(pedido.status)} className="text-sm px-3 py-1">
                {getStatusText(pedido.status)}
              </Badge>
            </div>

            <div className="flex gap-2">
              {canEdit && !isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}

              {isEditing && (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={updatePedido.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    {updatePedido.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna Esquerda */}
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Informações do Cliente
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome_cliente" className="text-sm font-medium">
                      Nome do Cliente
                    </Label>
                    <Input
                      id="nome_cliente"
                      value={formData.nome_cliente || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, nome_cliente: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone_cliente" className="text-sm font-medium">
                      Telefone
                    </Label>
                    <Input
                      id="telefone_cliente"
                      value={formData.telefone_cliente || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, telefone_cliente: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Endereço de Entrega
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="endereco_cliente" className="text-sm font-medium">
                    Endereço Completo
                  </Label>
                  <textarea
                    id="endereco_cliente"
                    value={formData.endereco_cliente || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endereco_cliente: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Observações</h3>

                <div className="space-y-2">
                  <textarea
                    value={formData.observacao_geral || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observacao_geral: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Observações do pedido..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-6">
              {/* Pagamento */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Pagamento
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meio_pagamento_descricao" className="text-sm font-medium">
                      Meio de Pagamento
                    </Label>
                    <Input
                      id="meio_pagamento_descricao"
                      value={formData.meio_pagamento_descricao || ""}
                      onChange={(e) => setFormData((prev:any) => ({ ...prev, meio_pagamento_descricao: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Valor Total</Label>
                    <Input
                      value={`R$ ${((pedido as any).valor_total || 0).toFixed(2)}`}
                      disabled
                      className="bg-white font-semibold text-lg text-green-700"
                    />
                  </div>
                </div>
              </div>

              {/* Tempo do Pedido */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Informações do Pedido
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Data/Hora do Pedido</Label>
                    <Input
                      value={
                        (pedido as any).data_criacao
                          ? new Date((pedido as any).data_criacao).toLocaleString("pt-BR")
                          : ""
                      }
                      disabled
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tempo Decorrido</Label>
                    <Input value={`${pedido.tempo_minutos || 0} minutos`} disabled className="bg-white font-semibold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!canEdit && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
                <div>
                  <p className="text-sm text-amber-800 font-medium">Pedido não editável</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Apenas pedidos com status "Pendente" ou "Em Preparo" podem ser modificados.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
