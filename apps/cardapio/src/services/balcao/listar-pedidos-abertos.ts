// @cardapio/services/balcao/listar-pedidos-abertos.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { PedidoBalcao } from "./types";

/**
 * Hook para listar pedidos de balcão abertos
 * Endpoint: GET /api/balcao/admin/pedidos
 * 
 * @example
 * ```tsx
 * const { data: pedidos } = useListarPedidosBalcaoAbertos();
 * ```
 */
export function useListarPedidosBalcaoAbertos() {
  return useQuery<PedidoBalcao[]>({
    queryKey: ["pedidos_balcao", "abertos"],
    queryFn: async () => {
      const { data } = await apiAdmin.get("/api/balcao/admin/pedidos");
      return data as PedidoBalcao[];
    },
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}

