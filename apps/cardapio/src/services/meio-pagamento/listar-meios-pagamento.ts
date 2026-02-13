// @cardapio/services/meio-pagamento/listar-meios-pagamento.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import { useQuery } from "@tanstack/react-query";
import type { MeioPagamento } from "./types";

/**
 * Hook para listar todos os meios de pagamento (apenas ativos)
 * Endpoint: GET /api/cadastros/client/meios-pagamento/
 * 
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: meiosPagamento } = useListarMeiosPagamento();
 * ```
 */
export function useListarMeiosPagamento(enabled = true) {
  return useQuery<MeioPagamento[]>({
    queryKey: ["meios_pagamento"],
    queryFn: async () => {
      // Garantir envio do x-super-token mesmo em SSR/contexts onde o interceptor pode não encontrar o cookie
      const token = getTokenCliente() || "";
      const { data } = await apiClienteAdmin.get<MeioPagamento[]>("/api/cadastros/client/meios-pagamento/", {
        headers: token ? { "x-super-token": token } : undefined,
      });
      // Filtrar apenas meios de pagamento ativos
      return data.filter(m => m.ativo !== false);
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

