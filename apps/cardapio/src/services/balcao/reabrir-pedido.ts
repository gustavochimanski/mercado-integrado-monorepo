// @cardapio/services/balcao/reabrir-pedido.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { PedidoBalcao } from "./types";

/**
 * Hook para reabrir pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/reabrir
 * 
 * @example
 * ```tsx
 * const reabrirPedido = useReabrirPedidoBalcao();
 * reabrirPedido.mutate(1);
 * ```
 */
export function useReabrirPedidoBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async (pedidoId: number) => {
      const response = await apiAdmin.post(`/api/balcao/admin/pedidos/${pedidoId}/reabrir`);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido reaberto com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao reabrir pedido")),
  });
}

