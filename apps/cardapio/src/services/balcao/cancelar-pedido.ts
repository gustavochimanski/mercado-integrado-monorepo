// @cardapio/services/balcao/cancelar-pedido.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { PedidoBalcao } from "./types";

/**
 * Hook para cancelar pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/cancelar
 * 
 * @example
 * ```tsx
 * const cancelarPedido = useCancelarPedidoBalcao();
 * cancelarPedido.mutate(1);
 * ```
 */
export function useCancelarPedidoBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async (pedidoId: number) => {
      const response = await apiAdmin.post(`/api/balcao/admin/pedidos/${pedidoId}/cancelar`);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido cancelado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao cancelar pedido")),
  });
}

