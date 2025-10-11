'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { KanbanBoard } from '../kanban/kanban-board'
import { buscarPedidosKanban } from '@/actions/pedidos/buscar-pedidos'
import { usePolling } from '@/hooks/use-polling'
import { toast } from 'sonner'
import type { Pedido } from '@/types/pedido'

interface Empresa {
  id: number
  nome: string
}

interface PedidosContainerProps {
  pedidosIniciais: Pedido[]
  empresas: Empresa[]
  dataInicial: string
  empresaIdInicial: string
}

/**
 * Container Client Component para gerenciar pedidos com polling automático
 */
export function PedidosContainer({
  pedidosIniciais,
  empresas,
  dataInicial,
  empresaIdInicial,
}: PedidosContainerProps) {
  const searchParams = useSearchParams()
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciais)
  const pedidosIdsRef = useRef<Set<number>>(new Set(pedidosIniciais.map(p => p.id)))

  // Pega os parâmetros atuais da URL
  const data = searchParams.get('data') || dataInicial
  const empresaId = searchParams.get('empresa_id') || empresaIdInicial

  // Função para buscar novos pedidos
  const buscarPedidos = useCallback(async () => {
    try {
      const resultado = await buscarPedidosKanban(data, empresaId)

      if (resultado.success && resultado.data) {
        const novosPedidos = resultado.data
        const idsAntigos = pedidosIdsRef.current

        // Verifica se há pedidos novos
        const pedidosNovos = novosPedidos.filter(p => !idsAntigos.has(p.id))

        if (pedidosNovos.length > 0) {
          // Mostra toast para pedidos novos
          if (pedidosNovos.length === 1) {
            toast.success(`Novo pedido #${pedidosNovos[0].id} recebido!`)
          } else {
            toast.success(`${pedidosNovos.length} novos pedidos recebidos!`)
          }
        }

        // Atualiza estado e referência
        setPedidos(novosPedidos)
        pedidosIdsRef.current = new Set(novosPedidos.map(p => p.id))
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error)
    }
  }, [data, empresaId])

  // Atualiza pedidos quando os parâmetros da URL mudam
  useEffect(() => {
    buscarPedidos()
  }, [buscarPedidos])

  // Polling automático a cada 10 segundos
  usePolling(buscarPedidos, {
    interval: 10000, // 10 segundos
    enabled: true, // Sempre ativo
    pauseOnInactive: true, // Pausa quando a aba não está visível
  })

  return (
    <div className="h-[calc(100vh-70px)]">
      <KanbanBoard pedidosIniciais={pedidos} empresas={empresas} />
    </div>
  )
}
