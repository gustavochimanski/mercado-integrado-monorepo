// @cardapio/services/balcao/buscar-historico.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { HistoricoBalcaoResponse } from "./types";

/**
 * Hook para buscar histórico de pedido de balcão
 * Endpoint: GET /api/balcao/admin/pedidos/{pedido_id}/historico?limit=100
 * 
 * @param pedidoId - ID do pedido
 * @param limit - Limite de registros (padrão: 100, máximo: 500)
 * 
 * @example
 * ```tsx
 * const { data: historico } = useBuscarHistoricoPedidoBalcao(pedidoId, 100);
 * ```
 */
export function useBuscarHistoricoPedidoBalcao(pedidoId: number | null, limit: number = 100) {
  return useQuery<HistoricoBalcaoResponse>({
    queryKey: ["historico_balcao", pedidoId, limit],
    queryFn: async () => {
      if (!pedidoId) throw new Error("Pedido ID é obrigatório");
      const { data } = await apiAdmin.get(
        `/api/balcao/admin/pedidos/${pedidoId}/historico?limit=${limit}`
      );
      return data as HistoricoBalcaoResponse;
    },
    enabled: !!pedidoId,
    staleTime: 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

