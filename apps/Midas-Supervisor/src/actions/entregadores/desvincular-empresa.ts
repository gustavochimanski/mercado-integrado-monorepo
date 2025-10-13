'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface DesvincularEmpresaResult {
  success: boolean
  error?: string
}

/**
 * DELETE /api/delivery/entregadores/{entregador_id}/vincular_empresa - Desvincular Entregador Empresa
 * Remove o vínculo entre um entregador e uma empresa
 */
export async function desvincularEntregadorEmpresa(
  entregadorId: number,
  empresaId: number
): Promise<DesvincularEmpresaResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores/${entregadorId}/vincular_empresa?empresa_id=${empresaId}`,
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
        error: error.detail || 'Erro ao desvincular entregador da empresa',
      }
    }

    revalidatePath('/entregadores')
    return { success: true }
  } catch (error) {
    console.error('Erro ao desvincular entregador da empresa:', error)
    return {
      success: false,
      error: 'Erro ao desvincular entregador da empresa',
    }
  }
}
