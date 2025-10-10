'use server'

import { cookies } from 'next/headers'

/**
 * Busca detalhes completos de um pedido específico
 *
 * @param pedidoId - ID do pedido
 * @returns Dados completos do pedido (itens, cliente, endereço, entregador)
 */
export async function buscarDetalhesPedido(pedidoId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/pedidos/admin/${pedidoId}`,
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
        error: error.detail || 'Erro ao buscar detalhes do pedido',
      }
    }

    const pedido = await response.json()
    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error)
    return { success: false, error: 'Erro ao buscar detalhes do pedido' }
  }
}
