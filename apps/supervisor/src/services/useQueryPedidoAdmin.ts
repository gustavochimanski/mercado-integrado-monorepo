// src/services/usePedidosAdmin.ts
import apiMensura from "@supervisor/lib/api/apiMensura";
import {
  PedidoKanban,
  PedidoStatus,
  PagamentoMetodo,
  PagamentoGateway,
} from "@supervisor/types/pedido";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toastSucess, toastErro } from "@supervisor/lib/toast";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";

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

  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PedidoStatus }) => {
      const { data } = await apiMensura.put(
        `/api/delivery/pedidos/status/${id}?status=${status}`
      );
      return data;
    },
    onSuccess: () => {
      toastSucess("Pedido atualizado com sucesso!");
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false });
    },
    onError: (err: any) => {
      toastErro(extractErrorMessage(err));
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
      toastSucess("Pagamento confirmado!");
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false });
    },
    onError: (err: any) => {
      toastErro(extractErrorMessage(err));
    },
  });

  return { atualizarStatus, confirmarPagamento };
}
