// @cardapio/services/balcao/fechar-conta.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { FecharContaBalcaoRequest, PedidoBalcao } from "./types";

/**
 * Hook para fechar conta do pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/fechar-conta
 * 
 * @example
 * ```tsx
 * const fecharConta = useFecharContaBalcao();
 * fecharConta.mutate({ pedidoId: 1, dados: { meio_pagamento_id: 1 } });
 * ```
 */
export function useFecharContaBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async ({ pedidoId, dados }: { pedidoId: number; dados?: FecharContaBalcaoRequest }) => {
      const response = await apiAdmin.post(
        `/api/balcao/admin/pedidos/${pedidoId}/fechar-conta`,
        dados || {}
      );
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Conta fechada com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao fechar conta")),
  });
}

