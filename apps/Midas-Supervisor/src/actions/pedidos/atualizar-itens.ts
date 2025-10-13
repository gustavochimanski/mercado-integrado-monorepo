'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface ItemPedido {
  item_id?: number
  produto_cod_barras: string
  quantidade: number
  observacao?: string
  acao: 'adicionar' | 'atualizar' | 'remover'
}

/**
 * Atualiza itens de um pedido (adicionar, atualizar ou remover)
 *
 * @param pedidoId - ID do pedido
 * @param itens - Array de itens para atualizar
 * @returns Resultado da operação
 */
export async function atualizarItensPedido(
  pedidoId: number,
  itens: ItemPedido[]
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/${pedidoId}/itens`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itens),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao atualizar itens do pedido',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao atualizar itens do pedido:', error)
    return { success: false, error: 'Erro ao atualizar itens do pedido' }
  }
}
