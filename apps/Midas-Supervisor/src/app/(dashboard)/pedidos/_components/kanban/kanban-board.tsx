'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useSearchParams } from 'next/navigation'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { FiltrosAvancados } from '../filtros/filtros-avancados'
import { FooterSelecaoLote } from '../footer/footer-selecao-lote'
import { ModalDetalhesPedido } from '../modal/modal-detalhes-pedido'
import { STATUS_ORDER } from '@/lib/constants/pedido-status'
import { atualizarStatusPedido } from '@/actions/pedidos/atualizar-status'
import type { Pedido, PedidoStatus } from '@/types/pedido'
import { toast } from 'sonner'
import { useImprimirPedido } from '@/hooks/use-imprimir-pedido'
import { CupomImpressao } from '@/components/shared/cupom-impressao'

interface Empresa {
  id: number
  nome: string
}

interface KanbanBoardProps {
  pedidosIniciais: Pedido[]
  empresas: Empresa[]
}

/**
 * Kanban Board - Container principal com drag-and-drop
 */
export function KanbanBoard({ pedidosIniciais, empresas }: KanbanBoardProps) {
  const searchParams = useSearchParams()
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set())
  const [activePedido, setActivePedido] = useState<Pedido | null>(null)
  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState<number | null>(
    null
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pedidosLocal, setPedidosLocal] = useState<Pedido[]>(pedidosIniciais)
  const [isDndReady, setIsDndReady] = useState(false)

  // Hook de impressão
  const { imprimirCupom, dadosImpressao, error: impressaoError } = useImprimirPedido()

  // Handler para imprimir cupom
  const handleImprimirCupom = useCallback(async (pedidoId: number) => {
    try {
      await imprimirCupom(pedidoId)
      // Não mostramos toast de sucesso pois não sabemos se o usuário
      // realmente imprimiu ou cancelou a janela de impressão
    } catch {
      toast.error('Erro ao imprimir cupom')
    }
  }, [imprimirCupom])

  // Mostrar toast de erro se houver
  useEffect(() => {
    if (impressaoError) {
      toast.error(impressaoError)
    }
  }, [impressaoError])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Habilitar DndContext apenas no cliente para evitar hydration errors
  useEffect(() => {
    setIsDndReady(true)
  }, [])

  // Sincronizar pedidos locais quando os pedidos iniciais mudarem
  useEffect(() => {
    setPedidosLocal(pedidosIniciais)
  }, [pedidosIniciais])

  const pedidos = useMemo(() => {
    const numero = searchParams.get('numero')
    const telefone = searchParams.get('telefone')
    const nome = searchParams.get('nome')?.toLowerCase()
    const endereco = searchParams.get('endereco')?.toLowerCase()

    return pedidosLocal.filter((pedido) => {
      if (numero && !pedido.id.toString().includes(numero)) return false
      if (telefone && !pedido.telefone_cliente.includes(telefone)) return false
      if (nome && !pedido.nome_cliente.toLowerCase().includes(nome)) return false
      if (endereco && !pedido.endereco.toLowerCase().includes(endereco)) return false
      return true
    })
  }, [pedidosLocal, searchParams])

  const pedidosPorStatus = useMemo(() => {
    const grupos = STATUS_ORDER.reduce(
      (acc, status) => {
        acc[status] = []
        return acc
      },
      {} as Record<PedidoStatus, Pedido[]>
    )

    pedidos.forEach((pedido) => {
      if (grupos[pedido.status]) {
        grupos[pedido.status].push(pedido)
      }
    })

    return grupos
  }, [pedidos])

  const toggleSelecao = useCallback((id: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev)
      if (novo.has(id)) {
        novo.delete(id)
      } else {
        novo.add(id)
      }
      return novo
    })
  }, [])

  // Limpar todas as seleções
  const limparSelecao = useCallback(() => {
    setSelecionados(new Set())
  }, [])

  // Abrir modal de detalhes
  const handleClickCard = useCallback((pedidoId: number) => {
    setPedidoSelecionadoId(pedidoId)
    setIsModalOpen(true)
  }, [])

  // Fechar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setPedidoSelecionadoId(null)
  }, [])

  // Quando começa a arrastar
  const handleDragStart = useCallback((event: DragEndEvent) => {
    const pedido = pedidos.find((p) => p.id === event.active.id)
    setActivePedido(pedido || null)
  }, [pedidos])

  // Quando solta o card
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActivePedido(null)

    if (!over || active.id === over.id) return

    const pedidoId = Number(active.id)
    const novoStatus = over.id as PedidoStatus

    // Atualização otimista: atualiza UI imediatamente
    setPedidosLocal((prev) =>
      prev.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      )
    )

    // Atualizar via Server Action
    const result = await atualizarStatusPedido(pedidoId, novoStatus)

    if (result.success) {
      toast.success('Status atualizado com sucesso!')
    } else {
      // Se falhar, reverte a mudança otimista
      setPedidosLocal(pedidosIniciais)
      toast.error(result.error || 'Erro ao atualizar status')
    }
  }, [pedidosIniciais])

  // Memoizar array de selecionados para evitar re-renders desnecessários
  const pedidosSelecionadosArray = useMemo(
    () => Array.from(selecionados),
    [selecionados]
  )

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Filtros */}
      <FiltrosAvancados empresas={empresas} />

      {/* Kanban Board */}
      {isDndReady ? (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 h-full">
            <div className="flex gap-4 h-full">
              {STATUS_ORDER.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  pedidos={pedidosPorStatus[status]}
                  selecionados={selecionados}
                  onToggleSelecao={toggleSelecao}
                  onClickCard={handleClickCard}
                  onImprimirCupom={handleImprimirCupom}
                />
              ))}
            </div>
          </div>

          {/* Overlay - Card que aparece enquanto arrasta */}
          <DragOverlay>
            {activePedido && (
              <KanbanCard
                pedido={activePedido}
                selecionado={false}
                onToggleSelecao={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex-1 h-full">
          <div className="flex gap-4 h-full">
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                pedidos={pedidosPorStatus[status]}
                selecionados={selecionados}
                onToggleSelecao={toggleSelecao}
                onClickCard={handleClickCard}
                onImprimirCupom={handleImprimirCupom}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer de Seleção em Lote */}
      <FooterSelecaoLote
        pedidosSelecionados={pedidosSelecionadosArray}
        onLimparSelecao={limparSelecao}
      />

      {/* Modal de Detalhes */}
      <ModalDetalhesPedido
        pedidoId={pedidoSelecionadoId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Template de Cupom para Impressão (oculto, só aparece no print) */}
      {dadosImpressao && <CupomImpressao dados={dadosImpressao} />}
    </div>
  )
}
