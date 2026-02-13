// src/services/useQueryEndereco.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin"
import { getTokenCliente } from "@cardapio/stores/client/ClientStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage"
import { getCliente } from "@cardapio/stores/client/ClientStore"

export interface Endereco {
  id: number;
  logradouro: string;
  numero: string; // obrigatório no front
  complemento?: string;
  bairro: string;
  distrito?: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  ponto_referencia?: string;
  padrao?: boolean;
}

export interface EnderecoSearchResult {
  estado: string | null
  codigo_estado: string | null
  cidade: string | null
  bairro: string | null
  distrito: string | null
  logradouro: string | null
  numero: string | null
  cep: string | null
  pais: string | null
  latitude: number
  longitude: number
  endereco_formatado: string
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
  cliente_id?: number
  logradouro: string
  numero?: string
  complemento?: string
  bairro?: string
  distrito?: string
  cidade: string
  estado: string
  codigo_estado?: string
  cep?: string
  pais?: string
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
      const token = getTokenCliente() || ""
      const { data } = await apiClienteAdmin.get("/api/cadastros/client/enderecos", {
        headers: token ? { "x-super-token": token } : undefined,
      })
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
      const clienteFromPayload = enderecoData.cliente_id
      const clienteFromStore = getCliente()?.id
      const resolvedClienteId = clienteFromPayload ?? (typeof clienteFromStore === "number" ? clienteFromStore : clienteFromStore ? Number(clienteFromStore) : undefined)

      if (!resolvedClienteId || Number.isNaN(resolvedClienteId)) {
        throw new Error("Não foi possível identificar o cliente. Faça login novamente e tente cadastrar o endereço.")
      }

      const payload = {
        ...enderecoData,
        cliente_id: resolvedClienteId,
      }

      const token = getTokenCliente() || ""
      const { data } = await apiClienteAdmin.post("/api/cadastros/client/enderecos", payload, {
        headers: token ? { "x-super-token": token } : undefined,
      })
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
      const clienteFromPayload = enderecoData.cliente_id
      const clienteFromStore = getCliente()?.id
      const resolvedClienteId = clienteFromPayload ?? (typeof clienteFromStore === "number" ? clienteFromStore : clienteFromStore ? Number(clienteFromStore) : undefined)

      if (!resolvedClienteId || Number.isNaN(resolvedClienteId)) {
        throw new Error("Não foi possível identificar o cliente. Faça login novamente e tente atualizar o endereço.")
      }

      const payload = {
        ...enderecoData,
        cliente_id: resolvedClienteId,
      }

      const token = getTokenCliente() || ""
      const { data } = await apiClienteAdmin.put(`/api/cadastros/client/enderecos/${id}`, payload, {
        headers: token ? { "x-super-token": token } : undefined,
      })
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
      const token = getTokenCliente() || ""
      await apiClienteAdmin.delete(`/api/cadastros/client/enderecos/${id}`, {
        headers: token ? { "x-super-token": token } : undefined,
      })
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

interface SearchEnderecoParams {
  text: string
  max_results?: number
}

// Função para busca de endereços na API externa (Google Maps)
// Endpoint: GET /api/localizacao/client/buscar-endereco?text={texto}&max_results={max_results}
// Usa X-Super-Token para autenticação (gerenciado automaticamente por apiClienteAdmin)
export function useSearchEndereco() {
  return useMutation({
    mutationFn: async (params: SearchEnderecoParams | string) => {
      // Suportar tanto objeto quanto string para compatibilidade
      const searchText = typeof params === "string" ? params : params.text
      const maxResults = typeof params === "string" ? 5 : (params.max_results ?? 5)
      
      if (!searchText.trim()) {
        throw new Error("Texto de busca é obrigatório")
      }
      
      // Validar max_results (1-10)
      const validMaxResults = Math.max(1, Math.min(10, maxResults))
      
      try {
        const queryParams = new URLSearchParams({
          text: searchText.trim(),
          max_results: validMaxResults.toString(),
        })
        
        const { data } = await apiClienteAdmin.get<EnderecoSearchResult[]>(
          `/api/localizacao/client/buscar-endereco?${queryParams.toString()}`
        )
        
        // A API retorna um array de EnderecoSearchResult diretamente
        return data
      } catch (error: any) {
        // Tratar erros específicos
        if (error.response?.status === 400) {
          throw new Error("Parâmetros inválidos. Verifique o texto de busca.")
        }
        if (error.response?.status === 401) {
          throw new Error("Token inválido. Faça login novamente.")
        }
        if (error.response?.status === 503) {
          throw new Error("Serviço de geolocalização não configurado. Verifique a configuração da API key do Google Maps.")
        }
        
        throw error
      }
    },
    onError: (err: any) => {
      console.error("Error searching address:", err)
      const message = err.message || extractErrorMessage(err, "Erro ao buscar endereço")
      toast.error(message)
    },
  })
}