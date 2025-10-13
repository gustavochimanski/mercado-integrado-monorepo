'use server'

import { cookies } from 'next/headers'
import type { PedidoStatus } from '@/types/pedido'

/**
 * Busca pedidos do Kanban (visão administrativa)
 *
 * @param data - Data do filtro no formato YYYY-MM-DD
 * @param empresaId - ID da empresa (obrigatório)
 * @returns Lista de pedidos do Kanban
 */
export async function buscarPedidosKanban(data: string, empresaId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/kanban?date_filter=${data}&empresa_id=${empresaId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao buscar pedidos',
      }
    }

    const pedidosApi = (await response.json()) as Array<{
      id: number
      status: string
      nome_cliente: string
      telefone_cliente: string
      endereco: string
      valor_total: number
      data_criacao: string
      entregador_nome?: string
    }>

    // Filtrar pedidos por data (workaround: API ignora o parâmetro date_filter)
    const pedidosFiltrados = pedidosApi.filter((p) => {
      if (!p.data_criacao) return false
      const dataPedido = p.data_criacao.split('T')[0]
      return dataPedido === data
    })

    // Mapear campos da API para nosso formato
    const pedidos = pedidosFiltrados.map((p) => ({
      id: p.id,
      status: p.status as PedidoStatus,
      nome_cliente: p.nome_cliente,
      telefone_cliente: p.telefone_cliente,
      endereco: p.endereco,
      valor_total: p.valor_total,
      data_pedido: p.data_criacao,
      empresa_id: Number(empresaId),
      entregador_nome: p.entregador_nome,
    }))

    return { success: true, data: pedidos }
  } catch (error) {
    console.error('Erro ao buscar pedidos do Kanban:', error)
    return { success: false, error: 'Erro ao buscar pedidos' }
  }
}

