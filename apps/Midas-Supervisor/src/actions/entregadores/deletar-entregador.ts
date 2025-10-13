'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface DeletarEntregadorResult {
  success: boolean
  error?: string
}

/**
 * DELETE /api/delivery/entregadores/{entregador_id} - Deletar Entregador
 * Remove um entregador do sistema
 */
export async function deletarEntregador(
  entregadorId: number
): Promise<DeletarEntregadorResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores/${entregadorId}`,
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
        error: error.detail || 'Erro ao deletar entregador',
      }
    }

    revalidatePath('/entregadores')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar entregador:', error)
    return { success: false, error: 'Erro ao deletar entregador' }
  }
}
