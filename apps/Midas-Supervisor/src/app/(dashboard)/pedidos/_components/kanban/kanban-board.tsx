'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { KanbanGrid } from './kanban-grid'
import { KanbanWithDnd } from './kanban-with-dnd'
import { KanbanWithEntregador } from './kanban-with-entregador'
import { FiltrosAvancados } from '../filtros/filtros-avancados'
import { FooterSelecaoLote } from '../footer/footer-selecao-lote'
import { ModalDetalhesPedido } from '../modal/modal-detalhes-pedido'
import { STATUS_ORDER } from '@/lib/constants/pedido-status'
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
 * Kanban Board - Container principal (REFATORADO)
 * Agora muito mais limpo, delegando lógica para componentes wrapper
 */
export function KanbanBoard({ pedidosIniciais, empresas }: KanbanBoardProps) {
  const searchParams = useSearchParams()
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set())
  const [pedidoSelecionadoId, setPedidoSelecionadoId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pedidosLocal, setPedidosLocal] = useState<Pedido[]>(pedidosIniciais)

  const { imprimirCupom, dadosImpressao, error: impressaoError } = useImprimirPedido()

  const handleImprimirCupom = useCallback(
    async (pedidoId: number) => {
      try {
        await imprimirCupom(pedidoId)
      } catch {
        toast.error('Erro ao imprimir cupom')
      }
    },
    [imprimirCupom]
  )

  useEffect(() => {
    if (impressaoError) {
      toast.error(impressaoError)
    }
  }, [impressaoError])

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

  const limparSelecao = useCallback(() => {
    setSelecionados(new Set())
  }, [])

  const handleClickCard = useCallback((pedidoId: number) => {
    setPedidoSelecionadoId(pedidoId)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setPedidoSelecionadoId(null)
  }, [])

  const pedidosSelecionadosArray = useMemo(
    () => Array.from(selecionados),
    [selecionados]
  )

  return (
    <KanbanWithEntregador setPedidosLocal={setPedidosLocal}>
      {({ handleMudancaStatus }) => (
        <div className="h-full flex flex-col gap-4">
          <div className="flex-shrink-0">
            <FiltrosAvancados empresas={empresas} />
          </div>

          <KanbanWithDnd
            pedidos={pedidos}
            pedidosLocal={pedidosLocal}
            handleMudancaStatus={handleMudancaStatus}
          >
            {({ handleAvancarStatus }) => (
              <KanbanGrid
                pedidosPorStatus={pedidosPorStatus}
                selecionados={selecionados}
                onToggleSelecao={toggleSelecao}
                onClickCard={handleClickCard}
                onImprimirCupom={handleImprimirCupom}
                onAvancarStatus={handleAvancarStatus}
              />
            )}
          </KanbanWithDnd>

          <FooterSelecaoLote
            pedidosSelecionados={pedidosSelecionadosArray}
            onLimparSelecao={limparSelecao}
            onMudancaStatusLote={handleMudancaStatus}
            pedidos={pedidosLocal}
          />

          <ModalDetalhesPedido
            pedidoId={pedidoSelecionadoId}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />

          {dadosImpressao && <CupomImpressao dados={dadosImpressao} />}
        </div>
      )}
    </KanbanWithEntregador>
  )
}
