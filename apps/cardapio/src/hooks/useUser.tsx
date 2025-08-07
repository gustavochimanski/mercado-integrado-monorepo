// src/hooks/useUser.ts
import { api } from '@cardapio/app/api/api'
import { useQuery } from '@tanstack/react-query'

export interface User {
  id: string
  nome?: string
  email?: string
  dataNascimento: string
  telefone: string
}

export interface UseUserResult {
  user: User | null
  isLoading: boolean
  isError: boolean
  error: unknown
}

export function useUser(): UseUserResult {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const resp = await api.get<User>('/delivery/cliente/')
      return resp.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  })

  return {
    user: data ?? null,
    isLoading,
    isError,
    error,
  }
}
