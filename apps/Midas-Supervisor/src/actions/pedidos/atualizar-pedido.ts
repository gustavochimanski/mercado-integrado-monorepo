'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface AtualizarPedidoData {
  meio_pagamento_id?: number
  endereco_id?: number
  cupom_id?: number | null
  observacao_geral?: string
  troco_para?: number
}

/**
 * Atualiza dados gerais de um pedido
 *
 * @param pedidoId - ID do pedido
 * @param data - Dados para atualização
 * @returns Resultado da operação
 */
export async function atualizarPedido(
  pedidoId: number,
  data: AtualizarPedidoData
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/${pedidoId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao atualizar pedido',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error)
    return { success: false, error: 'Erro ao atualizar pedido' }
  }
}
