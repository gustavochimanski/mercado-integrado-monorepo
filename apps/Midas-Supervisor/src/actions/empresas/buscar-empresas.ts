'use server'

import { cookies } from 'next/headers'
import type { EmpresaResponse } from '@/api'

/**
 * Busca todas as empresas disponíveis
 * @returns Lista de empresas
 */
export async function buscarEmpresas() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado', data: [] }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/mensura/empresas/`,
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
        error: error.detail || 'Erro ao buscar empresas',
        data: [],
      }
    }

    const empresas: EmpresaResponse[] = await response.json()
    return { success: true, data: empresas }
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    return { success: false, error: 'Erro ao buscar empresas', data: [] }
  }
}
