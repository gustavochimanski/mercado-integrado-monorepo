// src/services/useQueryEndereco.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage"

export interface EnderecoSearchResult {
  endereco_formatado: string
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  distrito?: string
  cidade: string
  estado: string
  codigo_estado?: string
  cep: string
  pais: string
  latitude: number
  longitude: number
  ponto_referencia?: string
}

export interface EnderecoSearchResponse {
  results: EnderecoSearchResult[]
}

// Tipos para endereços cadastrados do cliente
export interface EnderecoOut {
  id: number
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade: string
  estado: string
  cep?: string
  latitude?: number
  longitude?: number
  ponto_referencia?: string
  padrao?: boolean
  created_at: string
  updated_at: string
}

export interface EnderecoCreate {
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade: string
  estado: string
  cep?: string
  latitude?: number
  longitude?: number
  ponto_referencia?: string
  padrao?: boolean
}

// Função para buscar endereços cadastrados do cliente
export function useQueryEnderecos(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["enderecos"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/delivery/cliente/enderecos")
      return data as EnderecoOut[]
    },
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  })
}

// Função para mutações de endereços (criar, atualizar, deletar)
export function useMutateEndereco() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (enderecoData: EnderecoCreate) => {
      const { data } = await apiClienteAdmin.post("/delivery/cliente/enderecos", enderecoData)
      return data as EnderecoOut
    },
    onSuccess: () => {
      toast.success("Endereço criado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["enderecos"] })
    },
    onError: (err: any) => {
      console.error("Error creating address:", err)
      toast.error(extractErrorMessage(err, "Erro ao criar endereço"))
    },
  })

  const update = useMutation({
    mutationFn: async ({ id, ...enderecoData }: EnderecoCreate & { id: number }) => {
      const { data } = await apiClienteAdmin.put(`/delivery/cliente/enderecos/${id}`, enderecoData)
      return data as EnderecoOut
    },
    onSuccess: () => {
      toast.success("Endereço atualizado com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["enderecos"] })
    },
    onError: (err: any) => {
      console.error("Error updating address:", err)
      toast.error(extractErrorMessage(err, "Erro ao atualizar endereço"))
    },
  })

  const remove = useMutation({
    mutationFn: async (id: number) => {
      await apiClienteAdmin.delete(`/delivery/cliente/enderecos/${id}`)
    },
    onSuccess: () => {
      toast.success("Endereço removido com sucesso!")
      queryClient.invalidateQueries({ queryKey: ["enderecos"] })
    },
    onError: (err: any) => {
      console.error("Error deleting address:", err)
      toast.error(extractErrorMessage(err, "Erro ao remover endereço"))
    },
  })

  return { create, update, remove }
}

// Função para busca de endereços na API externa
export function useSearchEndereco() {
  return useMutation({
    mutationFn: async (searchText: string) => {
      if (!searchText.trim()) {
        throw new Error("Texto de busca é obrigatório")
      }
      
      const { data } = await apiClienteAdmin.get(`/mensura/geoapify/cliente/search-endereco?text=${searchText}`)
      // A API retorna um array de EnderecoSearchResult diretamente
      return data as EnderecoSearchResult[]
    },
    onError: (err: any) => {
      console.error("Error searching address:", err)
      toast.error(extractErrorMessage(err, "Erro ao buscar endereço"))
    },
  })
}