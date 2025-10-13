'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Vincula um entregador a um pedido
 *
 * @param pedidoId - ID do pedido
 * @param entregadorId - ID do entregador (null para desvincular)
 * @returns Resultado da operação
 */
export async function vincularEntregador(
  pedidoId: number,
  entregadorId: number | null
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/${pedidoId}/entregador?entregador_id=${entregadorId}`,
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
        error: error.detail || 'Erro ao vincular entregador',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao vincular entregador:', error)
    return { success: false, error: 'Erro ao vincular entregador' }
  }
}

/**
 * Desvincula o entregador de um pedido
 *
 * @param pedidoId - ID do pedido
 * @returns Resultado da operação
 */
export async function desvincularEntregador(pedidoId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/${pedidoId}/entregador`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao desvincular entregador',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao desvincular entregador:', error)
    return { success: false, error: 'Erro ao desvincular entregador' }
  }
}
