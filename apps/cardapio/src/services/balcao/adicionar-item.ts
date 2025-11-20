// @cardapio/services/balcao/adicionar-item.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { ItemPedidoBalcao, PedidoBalcao } from "./types";

/**
 * Hook para adicionar item ao pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/itens
 * 
 * @example
 * ```tsx
 * const adicionarItem = useAdicionarItemBalcao();
 * adicionarItem.mutate({ pedidoId: 1, item: { produto_cod_barras: "123", quantidade: 2 } });
 * ```
 */
export function useAdicionarItemBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async ({ pedidoId, item }: { pedidoId: number; item: ItemPedidoBalcao }) => {
      const response = await apiAdmin.post(
        `/api/balcao/admin/pedidos/${pedidoId}/itens`,
        item
      );
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Item adicionado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao adicionar item")),
  });
}

