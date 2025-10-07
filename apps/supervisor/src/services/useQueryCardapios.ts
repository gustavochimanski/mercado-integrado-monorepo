"use client"

import { useQuery } from "@tanstack/react-query"
import apiMensura from "@supervisor/lib/api/apiMensura"

// -----------------------------
// 🔎 Tipos
// -----------------------------
export interface CardapioEmpresa {
  id: number
  nome: string
  cardapio_link: string
  ativo: boolean
}

// -----------------------------
// ✅ Hooks de consulta
// -----------------------------
export function useCardapiosEmpresas(enabled = true) {
  return useQuery<CardapioEmpresa[]>({
    queryKey: ["cardapios-empresas"],
    queryFn: async () => {
      const { data } = await apiMensura.get<CardapioEmpresa[]>("/api/mensura/empresas/cardapios")
      return data
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}

export function useCardapioByEmpresaId(empresaId?: number) {
  return useQuery<CardapioEmpresa, Error>({
    queryKey: ["cardapio-empresa", empresaId],
    enabled: !!empresaId,
    queryFn: async () => {
      const { data } = await apiMensura.get<CardapioEmpresa>(`/api/mensura/empresas/${empresaId}/cardapio`)
      return data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
