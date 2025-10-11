'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface VincularEmpresaResult {
  success: boolean
  error?: string
}

/**
 * POST /api/delivery/entregadores/{entregador_id}/vincular_empresa - Vincular Entregador Empresa
 * Vincula um entregador a uma empresa
 */
export async function vincularEntregadorEmpresa(
  entregadorId: number,
  empresaId: number
): Promise<VincularEmpresaResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/entregadores/${entregadorId}/vincular_empresa?empresa_id=${empresaId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        error: error.detail || 'Erro ao vincular entregador à empresa',
      }
    }

    revalidatePath('/entregadores')
    return { success: true }
  } catch (error) {
    console.error('Erro ao vincular entregador à empresa:', error)
    return { success: false, error: 'Erro ao vincular entregador à empresa' }
  }
}
