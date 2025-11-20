// @cardapio/services/balcao/remover-item.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { PedidoBalcao } from "./types";

/**
 * Hook para remover item do pedido de balcão
 * Endpoint: DELETE /api/balcao/admin/pedidos/{pedido_id}/itens/{item_id}
 * 
 * @example
 * ```tsx
 * const removerItem = useRemoverItemBalcao();
 * removerItem.mutate({ pedidoId: 1, itemId: 123 });
 * ```
 */
export function useRemoverItemBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async ({ pedidoId, itemId }: { pedidoId: number; itemId: number }) => {
      const response = await apiAdmin.delete(
        `/api/balcao/admin/pedidos/${pedidoId}/itens/${itemId}`
      );
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Item removido com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao remover item")),
  });
}

