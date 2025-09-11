"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import apiMensura from "@supervisor/lib/api/apiMensura"
import { EmpresaMensura } from "@supervisor/types/empresas/TypeEmpresasMensura"
import { useToast } from "@supervisor/hooks/use-toast"
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon"

type ListParams = { skip?: number; limit?: number }

export interface EmpresaForm {
  nome: string
  cnpj?: string
  logo?: FileList
  endereco: {
    logradouro?: string
    numero?: string
    bairro?: string
    cidade?: string
    cep?: string
  }
  cardapio_link?: string
  cardapio_tema?: string
  aceita_pedido_automatico?: boolean
  tempo_entrega_maximo?: string
}

// --- utilitário para FormData
const buildFormData = (data: EmpresaForm, oldLogo?: string) => {
  const formData = new FormData()
  formData.append("nome", data.nome)
  formData.append("cnpj", data.cnpj ?? "")

  if (data.logo && data.logo[0]) {
    formData.append("logo", data.logo[0])
  } else if (oldLogo) {
    formData.append("logo_antiga", oldLogo)
  }

  formData.append("endereco", JSON.stringify({
    logradouro: data.endereco?.logradouro ?? "",
    numero: data.endereco?.numero ?? "",
    bairro: data.endereco?.bairro ?? "",
    cidade: data.endereco?.cidade ?? "",
    cep: data.endereco?.cep ?? "",
  }))

  if (data.cardapio_link) formData.append("cardapio_link", data.cardapio_link)
  if (data.cardapio_tema) formData.append("cardapio_tema", data.cardapio_tema)

  // Aceita pedido automático
  const aceitaPedido = (data as any).aceita_pedido_automatico ? "true" : "false"
  formData.append("aceita_pedido_automatico", aceitaPedido)

  // 🔹 Tempo de entrega máximo (com valor padrão se não vier)
  formData.append("tempo_entrega_maximo", data.tempo_entrega_maximo ?? "60")
  

  // 🔎 Log para debug
  console.log("💾 FormData enviado:")
  for (const [key, value] of formData.entries()) {
    console.log(key, value)
  }

  return formData
}



// --- Queries
export function useEmpresas({ skip = 0, limit = 100 }: ListParams = {}) {
  return useQuery<EmpresaMensura[], Error>({
    queryKey: ["empresas", skip, limit],
    queryFn: async () => {
      const { data } = await apiMensura.get("api/mensura/empresas/", { params: { skip, limit } })
      return data
    },
    staleTime: 60_000,
  })
}

export function useEmpresaById(id?: number) {
  return useQuery<EmpresaMensura, Error>({
    queryKey: ["empresa", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await apiMensura.get(`api/mensura/empresas/${id}`)
      return data
    },
  })
}

// --- Mutations
export function useCreateEmpresa() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: EmpresaForm) => {
      const formData = buildFormData(data)
      const { data: response } = await apiMensura.post("/api/mensura/empresas/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
      toast({ title: "Empresa cadastrada!", description: "Empresa cadastrada com sucesso!" })
    },
    onError: (err) => {
      const msg = getErrorMessage(err)
      toast({ title: "Erro ao cadastrar empresa", description: msg, variant: "destructive"  })
    },
  })
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: EmpresaForm }) => {
      const formData = buildFormData(data)
      const { data: response } = await apiMensura.put(`/api/mensura/empresas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      return response
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] })
      queryClient.invalidateQueries({ queryKey: ["empresa", id] })
      toast({ title: "Empresa atualizada!", description: "Empresa atualizada com sucesso!" })
    },
    onError: (err) => {
      const msg = getErrorMessage(err)
      toast({ title: "Erro ao atualizar empresa", description: msg, variant: "destructive"  })
    },
  })
}
