'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Entregador } from '@/types/entregador'

interface AtualizarEntregadorInput {
  nome?: string
  telefone?: string
  documento?: string
  veiculo_tipo?: string
  placa?: string
  acrescimo_taxa?: number
}

interface AtualizarEntregadorResult {
  success: boolean
  data?: Entregador
  error?: string
}

/**
 * PUT /api/delivery/entregadores/{entregador_id} - Atualizar Entregador
 * Atualiza os dados de um entregador existente
 */
export async function atualizarEntregador(
  entregadorId: number,
  input: AtualizarEntregadorInput
): Promise<AtualizarEntregadorResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores/${entregadorId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao atualizar entregador',
      }
    }

    const entregador: Entregador = await response.json()
    revalidatePath('/entregadores')
    return { success: true, data: entregador }
  } catch (error) {
    console.error('Erro ao atualizar entregador:', error)
    return { success: false, error: 'Erro ao atualizar entregador' }
  }
}
