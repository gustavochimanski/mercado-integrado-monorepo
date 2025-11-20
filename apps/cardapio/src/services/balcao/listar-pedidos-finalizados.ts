// @cardapio/services/balcao/listar-pedidos-finalizados.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { PedidoBalcao } from "./types";

/**
 * Hook para listar pedidos de balcão finalizados
 * Endpoint: GET /api/balcao/admin/pedidos/finalizados?data=YYYY-MM-DD
 * 
 * @param data - Data no formato YYYY-MM-DD (padrão: hoje)
 * 
 * @example
 * ```tsx
 * const { data: pedidos } = useListarPedidosBalcaoFinalizados("2024-01-01");
 * ```
 */
export function useListarPedidosBalcaoFinalizados(data?: string) {
  const hoje = data || new Date().toISOString().split('T')[0];
  
  return useQuery<PedidoBalcao[]>({
    queryKey: ["pedidos_balcao", "finalizados", hoje],
    queryFn: async () => {
      const { data } = await apiAdmin.get(
        `/api/balcao/admin/pedidos/finalizados?data=${hoje}`
      );
      return data as PedidoBalcao[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

