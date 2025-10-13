'use server'

import { cookies } from 'next/headers'
import type { Entregador } from '@/types/entregador'

interface BuscarEntregadorResult {
  success: boolean
  data?: Entregador
  error?: string
}

/**
 * GET /api/delivery/entregadores/{entregador_id} - Get Entregador
 * Busca um entregador específico por ID
 */
export async function buscarEntregador(
  entregadorId: number
): Promise<BuscarEntregadorResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores/${entregadorId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao buscar entregador',
      }
    }

    const entregador: Entregador = await response.json()
    return { success: true, data: entregador }
  } catch (error) {
    console.error('Erro ao buscar entregador:', error)
    return { success: false, error: 'Erro ao buscar entregador' }
  }
}
