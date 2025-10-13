'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import type { Entregador } from '@/types/entregador'

interface CriarEntregadorInput {
  nome: string
  telefone: string
  documento: string
  veiculo_tipo: string
  placa: string
  acrescimo_taxa?: number
}

interface CriarEntregadorResult {
  success: boolean
  data?: Entregador
  error?: string
}

/**
 * POST /api/delivery/entregadores - Criar Entregador
 * Cria um novo entregador no sistema
 */
export async function criarEntregador(
  input: CriarEntregadorInput
): Promise<CriarEntregadorResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/entregadores`,
      {
        method: 'POST',
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
        error: error.detail || 'Erro ao criar entregador',
      }
    }

    const entregador: Entregador = await response.json()
    revalidatePath('/entregadores')
    return { success: true, data: entregador }
  } catch (error) {
    console.error('Erro ao criar entregador:', error)
    return { success: false, error: 'Erro ao criar entregador' }
  }
}
