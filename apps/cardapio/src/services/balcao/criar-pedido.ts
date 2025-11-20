// @cardapio/services/balcao/criar-pedido.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { PedidoBalcaoCreate, PedidoBalcao } from "./types";

/**
 * Hook para criar pedido de balcão
 * Endpoint: POST /api/balcao/admin/pedidos
 * 
 * @example
 * ```tsx
 * const criarPedido = useCriarPedidoBalcao();
 * criarPedido.mutate({ mesa_id: 1, itens: [...] });
 * ```
 */
export function useCriarPedidoBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  return useMutation({
    mutationFn: async (data: PedidoBalcaoCreate) => {
      const response = await apiAdmin.post("/api/balcao/admin/pedidos", data);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido de balcão criado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao criar pedido de balcão")),
  });
}

