// @cardapio/services/balcao/buscar-pedido.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { PedidoBalcao } from "./types";

/**
 * Hook para buscar pedido de balcão por ID
 * Endpoint: GET /api/balcao/admin/pedidos/{pedido_id}
 * 
 * @param pedidoId - ID do pedido
 * @param enabled - Se deve buscar ou não (padrão: true se pedidoId existir)
 * 
 * @example
 * ```tsx
 * const { data: pedido } = useBuscarPedidoBalcao(pedidoId);
 * ```
 */
export function useBuscarPedidoBalcao(pedidoId: number | null, enabled: boolean = true) {
  return useQuery<PedidoBalcao>({
    queryKey: ["pedido_balcao", pedidoId],
    queryFn: async () => {
      if (!pedidoId) throw new Error("Pedido ID é obrigatório");
      const { data } = await apiAdmin.get(`/api/balcao/admin/pedidos/${pedidoId}`);
      return data as PedidoBalcao;
    },
    enabled: enabled && !!pedidoId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

