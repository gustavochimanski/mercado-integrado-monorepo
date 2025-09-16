// src/services/useQueryEndereco.ts
import apiMensura from "@supervisor/lib/api/apiMensura"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@supervisor/hooks/use-toast"
import { getErrorMessage } from "@supervisor/lib/getErrorMessage"
import type { Endereco, EnderecoSearchResponse } from "@supervisor/types/pedido"
import type { EnderecoOut } from "@supervisor/api/models/EnderecoOut"

export function useSearchEndereco() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (searchText: string) => {
      if (!searchText.trim()) {
        throw new Error("Texto de busca é obrigatório")
      }
      
      const { data } = await apiMensura.get(`/api/mensura/geoapify/search-endereco?text=${searchText}`)
      return data as EnderecoSearchResponse[]
    },
    onError: (err: any) => {
      console.error("Error searching address:", err)
      toast({
        title: "Erro",
        description: "Erro ao buscar endereço. Verifique o console para detalhes.",
        variant: "destructive",
      })
    },
  })
}

interface ClienteUpdateData {
  nome: string
  cpf: string
  telefone: string
  email: string
  data_nascimento: string
  ativo: boolean
  endereco: {
    acao: "update" | "create"
    id: number
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
    ponto_referencia: string
    latitude: number
    longitude: number
    is_principal: boolean
    // Campos adicionais da API de busca
    codigo_estado?: string
    distrito?: string
    pais?: string
  }
}

export function useUpdateEnderecoCliente() {
  const qc = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ 
      clienteId, 
      enderecoData 
    }: { 
      clienteId: number
      enderecoData: ClienteUpdateData
    }) => {
      const { data } = await apiMensura.put(`/api/delivery/cliente/admin-update/${clienteId}`, enderecoData)
      return data
    },
    onSuccess: () => {
      toast({ 
        title: "Cliente atualizado", 
        description: "As informações do cliente e endereço foram atualizadas com sucesso." 
      })
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false })
    },
    onError: (err: any) => {
      console.error("Error updating client address:", err)
      toast({ 
        title: "Erro ao atualizar cliente", 
        description: getErrorMessage(err), 
        variant: "destructive" 
      })
    },
  })
}

export function useEnderecosCliente(clienteId?: number) {
  return useQuery({
    queryKey: ["enderecosCliente", clienteId],
    queryFn: async () => {
      if (!clienteId) return []
      
      const { data } = await apiMensura.get(`/api/delivery/cliente/admin/${clienteId}/enderecos`)
      return data as EnderecoOut[]
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}