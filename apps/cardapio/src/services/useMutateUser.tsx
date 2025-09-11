// src/hooks/useMutateUser.ts
import { api } from '@cardapio/app/api/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { User } from './auth/userContext'

/**
 * Corpo esperado na criação de usuário
 */
export interface CreateUserBody {
  nome: string
  dataNascimento: string
  telefone: string
  // adicione outros campos caso seja necessário
}

/**
 * Corpo esperado na atualização de usuário
 */
export interface UpdateUserBody extends CreateUserBody {
  id: string
}

export function useMutateUser() {
  const qc = useQueryClient()

  const createUser = useMutation({
    mutationFn: (body: CreateUserBody) =>
      api.post<User>('/delivery/cliente/', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currentUser'] })
      toast.success('Usuário criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar usuário.')
    },
  })

  const updateUser = useMutation({
    mutationFn: ({ id, ...body }: UpdateUserBody) =>
      api.put<User>(`/delivery/cliente/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['currentUser'] })
      toast.success('Usuário atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar usuário.')
    },
  })

  return { createUser, updateUser }
}
