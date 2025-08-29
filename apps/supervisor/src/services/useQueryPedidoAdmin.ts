// src/services/usePedidosAdmin.ts
import apiMensura from "@supervisor/lib/api/apiMensura";
import {
  PedidoKanban,
  PedidoStatus,
  PagamentoMetodo,
  PagamentoGateway,
} from "@supervisor/types/pedido";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ListPedidosAdminParams {
  page?: number;
  limit?: number;
  status?: PedidoStatus;
}

// ---------------- Fetch: lista de pedidos (admin) ----------------
export function useFetchPedidosAdminKanban() {
  return useQuery<PedidoKanban[]>({
    queryKey: ["pedidosAdminKanban"],
    queryFn: async () => {
      const { data } = await apiMensura.get("/api/delivery/pedidos/admin/kanban");
      return data;
    },
    refetchInterval: 15000
  });
}

// ---------------- Mutations: ações em pedidos específicos ----------------
export function useMutatePedidoAdmin() {
  const qc = useQueryClient();

  // Atualiza status de um pedido (não usar /admin aqui!)
  const atualizarStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: PedidoStatus }) => {
      const { data } = await apiMensura.put(`/api/delivery/pedidos/status/${id}?status=${status}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso!");
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Erro ao atualizar pedido");
    },
  });

  // Confirma pagamento de um pedido
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
      toast.success("Pagamento confirmado!");
      qc.invalidateQueries({ queryKey: ["pedidosAdminKanban"], exact: false });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Erro ao confirmar pagamento");
    },
  });

  return { atualizarStatus, confirmarPagamento };
}
