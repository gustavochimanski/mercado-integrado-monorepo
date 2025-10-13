'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { PedidoStatus } from '@/types/pedido'

/**
 * Atualiza o status de múltiplos pedidos de uma vez
 */
export async function atualizarStatusEmLote(
  pedidoIds: number[],
  novoStatus: PedidoStatus
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    // Atualizar cada pedido individualmente
    const promises = pedidoIds.map((pedidoId) =>
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/pedidos/status/${pedidoId}?novo_status=${novoStatus}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
    )

    const responses = await Promise.all(promises)

    // Verificar se todas as requisições foram bem-sucedidas
    const errors = responses.filter((r) => !r.ok)

    if (errors.length > 0) {
      return {
        success: false,
        error: `Erro ao atualizar ${errors.length} pedido(s)`,
      }
    }

    // Revalidar a página após atualizar
    revalidatePath('/pedidos')

    return {
      success: true,
      message: `${pedidoIds.length} pedido(s) atualizado(s) com sucesso`,
    }
  } catch (error) {
    console.error('Erro ao atualizar pedidos em lote:', error)
    return { success: false, error: 'Erro ao atualizar pedidos em lote' }
  }
}
