'use server'

import { cookies } from 'next/headers'
import type { Entregador } from '@/types/entregador'

interface ListarEntregadoresResult {
  success: boolean
  data?: Entregador[]
  error?: string
}

/**
 * GET /api/delivery/entregadores - Listar Entregadores
 * Busca todos os entregadores cadastrados
 */
export async function listarEntregadores(): Promise<ListarEntregadoresResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores`,
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
        error: error.detail || 'Erro ao listar entregadores',
      }
    }

    const entregadores: Entregador[] = await response.json()
    return { success: true, data: entregadores }
  } catch (error) {
    console.error('Erro ao listar entregadores:', error)
    return { success: false, error: 'Erro ao listar entregadores' }
  }
}
