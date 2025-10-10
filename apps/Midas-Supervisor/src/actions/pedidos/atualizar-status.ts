'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { PedidoStatus } from '@/types/pedido'

/**
 * Atualiza o status de um pedido
 *
 * @param pedidoId - ID do pedido
 * @param novoStatus - Novo status do pedido
 * @returns Resultado da operação
 */
export async function atualizarStatusPedido(
  pedidoId: number,
  novoStatus: PedidoStatus
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/pedidos/admin/status/${pedidoId}?novo_status=${novoStatus}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao atualizar status do pedido',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error)
    return { success: false, error: 'Erro ao atualizar status do pedido' }
  }
}

/**
 * Atualiza o status de múltiplos pedidos em lote
 *
 * @param pedidoIds - Array com IDs dos pedidos
 * @param novoStatus - Novo status: 'P' | 'I' | 'R' | 'S' | 'E' | 'C' | 'D'
 * @returns Resultado da operação
 */
export async function atualizarStatusEmLote(
  pedidoIds: number[],
  novoStatus: 'P' | 'I' | 'R' | 'S' | 'E' | 'C' | 'D'
) {
  try {
    const promises = pedidoIds.map((id) => atualizarStatusPedido(id, novoStatus))
    await Promise.all(promises)

    revalidatePath('/pedidos')

    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar pedidos em lote:', error)
    return { success: false, error: 'Erro ao atualizar pedidos' }
  }
}
