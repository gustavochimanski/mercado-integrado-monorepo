"use client"

import type { PedidoKanban } from "@supervisor/types/pedido"
import React, { useState } from "react"
import TempoPedidoBadge from "./TempoPedidoBadge"
import { PedidoModal } from "./modal"
import { Checkbox } from "@supervisor/components/ui/checkbox"
import { isToday, parseISO } from "date-fns"
import { ChevronRight, Eye, Printer } from "lucide-react"
import { useMutatePedidoAdmin } from "@supervisor/services/useQueryPedidoAdmin"
import { SelecionarEntregadorModal } from "./SelecionarEntregadorModal"
import { useQueryClient } from "@tanstack/react-query"

// Componente PedidoCard
export const PedidoCard = React.memo(
  ({
    pedido,
    selecionado,
    onToggleSelecionado,
    selectedDate,
  }: {
    pedido: PedidoKanban
    selecionado: boolean
    onToggleSelecionado: (id: number) => void
    selectedDate: string
  }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEntregadorModalOpen, setIsEntregadorModalOpen] = useState(false)
    const { atualizarStatus, vincularEntregador } = useMutatePedidoAdmin()
    const queryClient = useQueryClient()

    const mostrarTempoBadge = pedido.status !== "C" && pedido.status !== "E" && isToday(parseISO(selectedDate))

    // Lógica para determinar o próximo status
    const getNextStatus = (currentStatus: string): string => {
      const statusOrder: string[] = ["P", "R", "S", "E", "C"]
      const currentIndex = statusOrder.indexOf(currentStatus)
      return currentIndex < statusOrder.length - 1 ? statusOrder[currentIndex + 1] : currentStatus
    }

    // Função para atualizar o status do pedido
    const handleNextStatus = () => {
      const nextStatus = getNextStatus(pedido.status)

      // Se o próximo status for "S" (Saiu para Entrega), verificar se precisa vincular entregador
      if (nextStatus === "S" && !pedido.motoboy) {
        setIsEntregadorModalOpen(true)
        return
      }

      // Se não precisa vincular entregador, atualizar status diretamente
      atualizarStatus.mutate({ id: pedido.id, status: nextStatus as any })
    }

    // Função para confirmar seleção de entregador
    const handleConfirmEntregador = async (entregadorId: number) => {
      try {
        // Primeiro vincula o entregador
        await vincularEntregador.mutateAsync({ pedidoId: pedido.id, entregadorId })
        // Depois atualiza o status
        atualizarStatus.mutate({ id: pedido.id, status: "S" as any })
      } catch (error) {
        // O erro já é tratado pelo hook
        console.error('Erro ao vincular entregador:', error)
      }
    }

    // Renderização do componente
    return (
      <>
        <div className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-2 text-sm">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Checkbox checked={selecionado} onCheckedChange={() => onToggleSelecionado(pedido.id)} />
            <div className="flex justify-between w-full">
              <div className="flex gap-2">
                <p className="font-semibold text-primary ">#{pedido.id}</p>
                <p className="text-muted-foreground">{pedido.nome_cliente || "—"}</p>
              </div>
              <div className="flex mt-auto gap-2">
                {mostrarTempoBadge && <TempoPedidoBadge dataCriacao={pedido.data_criacao} limiteMinutos={30} />}
              </div>
            </div>
          </div>

          {/* Informações do cliente */}
          <div className="text-sm text-muted-foreground flex flex-col gap-1">
            <span>
              <strong>Telefone:</strong> {pedido.telefone_cliente || "—"}
            </span>
            {pedido.endereco && (
              <span>
                <strong>Endereço:</strong> {pedido.endereco}
              </span>
            )}
            <span>
              <strong>Meio de Pagamento:</strong> {pedido.meio_pagamento_descricao || "—"}
            </span>
            {(pedido.status === "S" || pedido.status === "E") && pedido.motoboy && (
              <span>
                <strong>Motoboy:</strong> {pedido.motoboy}
              </span>
            )}
          </div>

          {/* Valor total */}
          <div className="flex justify-between font-bold text-foreground">
            R$ {pedido.valor_total.toFixed(2)}

            {/* Ações */}
            <div className="flex gap-1">
              <button
                className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors"
                onClick={() => setIsModalOpen(true)}
                title="Visualizar pedido"
              >
                <Eye size={15} />
              </button>
              <button className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors">
                <Printer size={15} />
              </button>
              <button
                className="bg-primary/20 text-primary rounded-full px-2 hover:bg-primary/30 transition-colors"
                onClick={handleNextStatus}
                title="Próximo status"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>

        <PedidoModal pedido={pedido} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <SelecionarEntregadorModal
          isOpen={isEntregadorModalOpen}
          onClose={() => setIsEntregadorModalOpen(false)}
          onConfirm={handleConfirmEntregador}
          pedidoId={pedido.id}
        />
      </>
    )
  },
)

PedidoCard.displayName = "PedidoCard"