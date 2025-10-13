'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface ConfirmarPagamentoData {
  metodo?: string
  gateway?: string | null
}

/**
 * Confirma o pagamento de um pedido
 *
 * @param pedidoId - ID do pedido
 * @param data - Dados do pagamento (método e gateway)
 * @returns Resultado da operação
 */
export async function confirmarPagamento(
  pedidoId: number,
  data: ConfirmarPagamentoData
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/client/pagamentos/${pedidoId}/confirmar`,
      {
        method: 'POST',
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
        error: error.detail || 'Erro ao confirmar pagamento',
      }
    }

    const pedido = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: pedido }
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error)
    return { success: false, error: 'Erro ao confirmar pagamento' }
  }
}
