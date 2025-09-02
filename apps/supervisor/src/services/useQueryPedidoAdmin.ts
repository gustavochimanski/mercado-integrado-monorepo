// src/services/usePedidosAdmin.ts
import apiMensura from "@supervisor/lib/api/apiMensura";
import {
  PedidoKanban,
  PedidoStatus,
  PagamentoMetodo,
  PagamentoGateway,
} from "@supervisor/types/pedido";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

export function useFetchPedidosAdminKanban() {
  return useQuery<PedidoKanban[]>({
    queryKey: ["pedidosAdminKanban"],
    queryFn: async () => {
      const { data } = await apiMensura.get("/api/delivery/pedidos/admin/kanban");
      return data;
    },
    refetchInterval: 15000,
  });
}

export function useMutatePedidoAdmin() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false });

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PedidoStatus }) => {
      const { data } = await apiMensura.put(
        `/api/delivery/pedidos/status/${id}?status=${status}`
      );
      return data;
    },
    onSuccess: () => {
      toast({ title: "Pedido atualizado", description: "O status do pedido foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err: any) => {
      toast({ title: "Erro ao atualizar pedido", description: getErrorMessage(err), variant: "destructive"  });
    },
  });

  const confirmarPagamento = useMutation({
    mutationFn: async ({
      id,
      metodo,
      gateway,
    }: {
      id: number;
      metodo?: PagamentoMetodo;
      gateway?: PagamentoGateway;
    }) => {
      const { data } = await apiMensura.post(
        `/api/delivery/pedidos/${id}/confirmar-pagamento`,
        { metodo, gateway }
      );
      return data;
    },
    onSuccess: () => {
      toast({ title: "Pagamento confirmado", description: "O pagamento do pedido foi confirmado com sucesso." });
      invalidate();
    },
    onError: (err: any) => {
      toast({ title: "Erro ao confirmar pagamento", description: getErrorMessage(err), variant: "destructive"  });
    },
  });

  return { atualizarStatus, confirmarPagamento };
}
