'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface AtualizarEnderecoData {
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  ponto_referencia?: string
  latitude?: number
  longitude?: number
  is_principal?: boolean
}

/**
 * Atualiza endereço de entrega de um cliente
 *
 * @param clienteId - ID do cliente
 * @param enderecoId - ID do endereço
 * @param data - Dados do endereço
 * @returns Resultado da operação
 */
export async function atualizarEndereco(
  clienteId: number,
  enderecoId: number,
  data: AtualizarEnderecoData
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/enderecos/admin/cliente/${clienteId}/endereco/${enderecoId}`,
      {
        method: 'PUT',
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
        error: error.detail || 'Erro ao atualizar endereço',
      }
    }

    const endereco = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: endereco }
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error)
    return { success: false, error: 'Erro ao atualizar endereço' }
  }
}
