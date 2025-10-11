'use client'

import { useState, useCallback, ReactNode } from 'react'
import { atualizarStatusPedido } from '@/actions/pedidos/atualizar-status'
import { vincularEntregador, desvincularEntregador } from '@/actions/pedidos/vincular-entregador'
import {
  precisaVincularEntregador,
  podeDesvincularEntregador,
} from '@/lib/helpers/entregador-status'
import { ModalSelecionarEntregador } from '../modal/modal-selecionar-entregador'
import { ModalDesvincularEntregador } from '../modal/modal-desvincular-entregador'
import type { Pedido, PedidoStatus } from '@/types/pedido'
import { toast } from 'sonner'

interface KanbanWithEntregadorProps {
  setPedidosLocal: React.Dispatch<React.SetStateAction<Pedido[]>>
  children: (props: {
    handleMudancaStatus: (pedidos: Pedido[], novoStatus: PedidoStatus) => Promise<void>
  }) => ReactNode
}

/**
 * Componente wrapper que gerencia toda lógica de vinculação de entregador
 * Usa render props para passar handlers para os filhos
 */
export function KanbanWithEntregador({ setPedidosLocal, children }: KanbanWithEntregadorProps) {
  const [modalEntregadorOpen, setModalEntregadorOpen] = useState(false)
  const [modalDesvincularOpen, setModalDesvincularOpen] = useState(false)
  const [pedidosPendentesVinculo, setPedidosPendentesVinculo] = useState<Pedido[]>([])
  const [novoStatusPendente, setNovoStatusPendente] = useState<PedidoStatus | null>(null)
  const [empresaIdFiltro, setEmpresaIdFiltro] = useState<number | undefined>(undefined)
  const [statusAnteriorParaRollback, setStatusAnteriorParaRollback] = useState<
    Map<number, PedidoStatus>
  >(new Map())

  const handleVincularEntregador = useCallback(
    async (entregadorId: number) => {
      if (!novoStatusPendente) return

      try {
        const promises = pedidosPendentesVinculo.map((pedido) =>
          vincularEntregador(pedido.id, entregadorId)
        )
        const results = await Promise.all(promises)
        const errors = results.filter((r) => !r.success)

        if (errors.length > 0) {
          toast.error(`Erro ao vincular entregador em ${errors.length} pedido(s)`)
          return
        }

        const updatePromises = pedidosPendentesVinculo.map((pedido) =>
          atualizarStatusPedido(pedido.id, novoStatusPendente)
        )
        const updateResults = await Promise.all(updatePromises)
        const updateErrors = updateResults.filter((r) => !r.success)

        if (updateErrors.length > 0) {
          toast.error(`Erro ao atualizar status de ${updateErrors.length} pedido(s)`)
          return
        }

        toast.success('Entregador vinculado e status atualizado!')

        // Apenas atualiza o entregador_id (status já foi atualizado otimisticamente antes do modal)
        setPedidosLocal((prev) =>
          prev.map((p) => {
            const pedidoAtualizado = pedidosPendentesVinculo.find((pp) => pp.id === p.id)
            if (pedidoAtualizado) {
              return { ...p, entregador_id: entregadorId }
            }
            return p
          })
        )

        setPedidosPendentesVinculo([])
        setNovoStatusPendente(null)
        setStatusAnteriorParaRollback(new Map()) // Clear since operation succeeded
        setModalEntregadorOpen(false)
      } catch (error) {
        console.error('Erro ao vincular entregador:', error)
        toast.error('Erro ao vincular entregador')
      }
    },
    [pedidosPendentesVinculo, novoStatusPendente, setPedidosLocal]
  )

  const handleDesvincularEntregador = useCallback(async () => {
    if (!novoStatusPendente) return

    try {
      const promises = pedidosPendentesVinculo.map((pedido) =>
        desvincularEntregador(pedido.id)
      )
      const results = await Promise.all(promises)
      const errors = results.filter((r) => !r.success)

      if (errors.length > 0) {
        toast.error(`Erro ao desvincular entregador em ${errors.length} pedido(s)`)
        return
      }

      const updatePromises = pedidosPendentesVinculo.map((pedido) =>
        atualizarStatusPedido(pedido.id, novoStatusPendente)
      )
      const updateResults = await Promise.all(updatePromises)
      const updateErrors = updateResults.filter((r) => !r.success)

      if (updateErrors.length > 0) {
        toast.error(`Erro ao atualizar status de ${updateErrors.length} pedido(s)`)
        return
      }

      toast.success('Entregador desvinculado e status atualizado!')

      // Apenas atualiza o entregador (status já foi atualizado otimisticamente antes do modal)
      setPedidosLocal((prev) =>
        prev.map((p) => {
          const pedidoAtualizado = pedidosPendentesVinculo.find((pp) => pp.id === p.id)
          if (pedidoAtualizado) {
            return { ...p, entregador_id: null, entregador_nome: undefined }
          }
          return p
        })
      )

      setPedidosPendentesVinculo([])
      setNovoStatusPendente(null)
      setStatusAnteriorParaRollback(new Map()) // Clear since operation succeeded
      setModalDesvincularOpen(false)
    } catch (error) {
      console.error('Erro ao desvincular entregador:', error)
      toast.error('Erro ao desvincular entregador')
    }
  }, [pedidosPendentesVinculo, novoStatusPendente, setPedidosLocal])

  const handleManterVinculo = useCallback(async () => {
    if (!novoStatusPendente) return

    try {
      const promises = pedidosPendentesVinculo.map((pedido) =>
        atualizarStatusPedido(pedido.id, novoStatusPendente)
      )
      const results = await Promise.all(promises)
      const errors = results.filter((r) => !r.success)

      if (errors.length > 0) {
        toast.error(`Erro ao atualizar status de ${errors.length} pedido(s)`)
        return
      }

      toast.success('Status atualizado, entregador mantido!')

      // Não precisa atualizar nada (status já foi atualizado otimisticamente antes do modal)
      setPedidosPendentesVinculo([])
      setNovoStatusPendente(null)
      setStatusAnteriorParaRollback(new Map()) // Clear since operation succeeded
      setModalDesvincularOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast.error('Erro ao atualizar status')
    }
  }, [pedidosPendentesVinculo, novoStatusPendente])

  const handleMudancaStatus = useCallback(
    async (pedidos: Pedido[], novoStatus: PedidoStatus) => {
      const pedidoComStatus = pedidos[0]
      if (!pedidoComStatus) return

      const statusAtual = pedidoComStatus.status

      if (precisaVincularEntregador(statusAtual, novoStatus)) {
        // Save original status for rollback
        const rollbackMap = new Map<number, PedidoStatus>()
        pedidos.forEach((p) => rollbackMap.set(p.id, p.status))
        setStatusAnteriorParaRollback(rollbackMap)

        // Atualização otimista: move o card ANTES de abrir o modal
        setPedidosLocal((prev) =>
          prev.map((p) => {
            const pedidoAtualizado = pedidos.find((pp) => pp.id === p.id)
            if (pedidoAtualizado) {
              return { ...p, status: novoStatus }
            }
            return p
          })
        )

        setPedidosPendentesVinculo(pedidos)
        setNovoStatusPendente(novoStatus)
        setEmpresaIdFiltro(pedidos[0].empresa_id)
        setModalEntregadorOpen(true)
      } else if (podeDesvincularEntregador(statusAtual, novoStatus)) {
        const pedidosComEntregador = pedidos.filter((p) => p.entregador_id)

        if (pedidosComEntregador.length > 0) {
          // Save original status for rollback
          const rollbackMap = new Map<number, PedidoStatus>()
          pedidosComEntregador.forEach((p) => rollbackMap.set(p.id, p.status))
          setStatusAnteriorParaRollback(rollbackMap)

          // Atualização otimista: move o card ANTES de abrir o modal
          setPedidosLocal((prev) =>
            prev.map((p) => {
              const pedidoAtualizado = pedidosComEntregador.find((pp) => pp.id === p.id)
              if (pedidoAtualizado) {
                return { ...p, status: novoStatus }
              }
              return p
            })
          )

          setPedidosPendentesVinculo(pedidosComEntregador)
          setNovoStatusPendente(novoStatus)
          setModalDesvincularOpen(true)
        } else {
          // Atualização otimista ANTES de chamar API
          setPedidosLocal((prev) =>
            prev.map((p) => {
              const pedidoAtualizado = pedidos.find((pp) => pp.id === p.id)
              if (pedidoAtualizado) {
                return { ...p, status: novoStatus }
              }
              return p
            })
          )

          const promises = pedidos.map((p) => atualizarStatusPedido(p.id, novoStatus))
          const results = await Promise.all(promises)
          const errors = results.filter((r) => !r.success)

          if (errors.length > 0) {
            toast.error(`Erro ao atualizar ${errors.length} pedido(s)`)
          } else {
            toast.success('Status atualizado com sucesso!')
          }
        }
      } else {
        // Atualização otimista ANTES de chamar API
        setPedidosLocal((prev) =>
          prev.map((p) => {
            const pedidoAtualizado = pedidos.find((pp) => pp.id === p.id)
            if (pedidoAtualizado) {
              return { ...p, status: novoStatus }
            }
            return p
          })
        )

        const promises = pedidos.map((p) => atualizarStatusPedido(p.id, novoStatus))
        const results = await Promise.all(promises)
        const errors = results.filter((r) => !r.success)

        if (errors.length > 0) {
          toast.error(`Erro ao atualizar ${errors.length} pedido(s)`)
        } else {
          toast.success('Status atualizado com sucesso!')
        }
      }
    },
    [setPedidosLocal]
  )

  return (
    <>
      {children({ handleMudancaStatus })}

      {/* Modal para Selecionar Entregador */}
      <ModalSelecionarEntregador
        isOpen={modalEntregadorOpen}
        onClose={() => {
          // Rollback: restore original status
          setPedidosLocal((prev) =>
            prev.map((p) => {
              const originalStatus = statusAnteriorParaRollback.get(p.id)
              if (originalStatus) {
                return { ...p, status: originalStatus }
              }
              return p
            })
          )

          setModalEntregadorOpen(false)
          setPedidosPendentesVinculo([])
          setNovoStatusPendente(null)
          setStatusAnteriorParaRollback(new Map())
        }}
        onConfirmar={handleVincularEntregador}
        pedidosComEntregador={pedidosPendentesVinculo
          .filter((p) => p.entregador_id)
          .map((p) => ({
            pedidoId: p.id,
            entregadorNome: p.entregador_nome || 'Desconhecido',
          }))}
        empresaId={empresaIdFiltro}
      />

      {/* Modal para Desvincular Entregador */}
      <ModalDesvincularEntregador
        isOpen={modalDesvincularOpen}
        onClose={() => {
          // Rollback: restore original status
          setPedidosLocal((prev) =>
            prev.map((p) => {
              const originalStatus = statusAnteriorParaRollback.get(p.id)
              if (originalStatus) {
                return { ...p, status: originalStatus }
              }
              return p
            })
          )

          setModalDesvincularOpen(false)
          setPedidosPendentesVinculo([])
          setNovoStatusPendente(null)
          setStatusAnteriorParaRollback(new Map())
        }}
        onConfirmarDesvincular={handleDesvincularEntregador}
        onManterVinculo={handleManterVinculo}
        pedidosComEntregador={pedidosPendentesVinculo.map((p) => ({
          pedidoId: p.id,
          entregadorNome: p.entregador_nome || 'Desconhecido',
        }))}
      />
    </>
  )
}
