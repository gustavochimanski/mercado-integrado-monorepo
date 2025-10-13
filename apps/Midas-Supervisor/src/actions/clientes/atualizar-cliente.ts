'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

interface AtualizarClienteData {
  nome: string
  cpf?: string | null
  telefone: string
  email?: string | null
  data_nascimento?: string | null
  ativo?: boolean
  endereco?: unknown
}

/**
 * Atualiza dados cadastrais de um cliente
 *
 * @param clienteId - ID do cliente
 * @param data - Dados para atualização
 * @returns Resultado da operação
 */
export async function atualizarCliente(
  clienteId: number,
  data: AtualizarClienteData
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return { success: false, error: 'Não autenticado' }
  }

  // Validações
  if (!data.nome?.trim()) {
    return { success: false, error: 'Nome é obrigatório' }
  }
  if (!data.telefone?.trim()) {
    return { success: false, error: 'Telefone é obrigatório' }
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/delivery/admin/cliente/update/${clienteId}`,
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
        error: error.detail || 'Erro ao atualizar cliente',
      }
    }

    const cliente = await response.json()

    // Invalida o cache da página de pedidos
    revalidatePath('/pedidos')

    return { success: true, data: cliente }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return { success: false, error: 'Erro ao atualizar cliente' }
  }
}
