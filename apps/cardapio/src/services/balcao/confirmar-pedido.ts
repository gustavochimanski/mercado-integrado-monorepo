// @cardapio/services/balcao/confirmar-pedido.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { PedidoBalcao } from "./types";

/**
 * Hook para confirmar pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/confirmar
 * 
 * @example
 * ```tsx
 * const confirmarPedido = useConfirmarPedidoBalcao();
 * confirmarPedido.mutate(1);
 * ```
 */
export function useConfirmarPedidoBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async (pedidoId: number) => {
      const response = await apiAdmin.post(`/api/balcao/admin/pedidos/${pedidoId}/confirmar`);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido confirmado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao confirmar pedido")),
  });
}

