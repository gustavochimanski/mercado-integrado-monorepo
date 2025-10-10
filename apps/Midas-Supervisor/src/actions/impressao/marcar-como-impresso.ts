'use server'

import { cookies } from 'next/headers'
import type { RespostaImpressao } from '@/types/impressao'

/**
 * Marca um pedido como impresso no sistema
 *
 * @param pedidoId - ID do pedido que foi impresso
 * @returns Confirmação da marcação
 */
export async function marcarComoImpresso(pedidoId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return {
      success: false,
      error: 'Não autenticado'
    }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/printer/marcar-impresso/${pedidoId}`,
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
        error: error.detail || 'Erro ao marcar pedido como impresso',
      }
    }

    const resultado: RespostaImpressao = await response.json()

    return {
      success: true,
      data: resultado
    }
  } catch (error) {
    console.error('Erro ao marcar pedido como impresso:', error)
    return {
      success: false,
      error: 'Erro ao marcar pedido como impresso'
    }
  }
}
