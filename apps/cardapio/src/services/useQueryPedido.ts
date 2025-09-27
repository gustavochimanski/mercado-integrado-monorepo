import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pedido } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";

/** 🔎 Tipo de um pedido resumido */
export interface PedidoItem {
  id: number;
  cliente_nome: string;
  status: string;
  valor_total: number;
  data_criacao: string;
}

// ==========================================================================
// ================= Listar pedidos =================
// ==========================================================================
export function usePedidos() {
  return useQuery<Pedido[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<Pedido[]>("/api/delivery/cliente/pedidos/");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// ==========================================================================
// ================= Hook para buscar pedido por ID =========================
// ==========================================================================
export function usePedidoById(pedidoId: number | null, opts?: { enabled?: boolean }) {
  const qc = useQueryClient();
  const seed = pedidoId ? qc.getQueryData<PedidoItem>(["pedido", pedidoId]) : undefined;

  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<PedidoItem>(`/delivery/cliente/pedidos/${pedidoId}`);
      return data;
    },
    initialData: seed,
    enabled: !!pedidoId && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}



// ==========================================================================
// ==========  Mutations para criar/atualizar/remover pedidos ===============
// ==========================================================================
export function useMutatePedido() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos"] });
    qc.invalidateQueries({ queryKey: ["pedidos_search"] });
  };

  const create = useMutation({
    mutationFn: (body: Partial<PedidoItem>) => apiAdmin.post("/delivery/cliente/pedidos", body),
    onSuccess: () => {
      toast.success("Pedido criado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiAdmin.patch(`/delivery/pedidos/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      invalidate(); 
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });


  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`/delivery/cliente/pedidos/${id}`),
    onSuccess: () => {
      toast.success("Pedido removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const toggleModoEdicao = useMutation({
    mutationFn: ({ id, modo }: { id: number; modo: boolean }) =>
      apiClienteAdmin.put(`/api/delivery/cliente/pedidos/${id}/modo-edicao`, { modo_edicao: modo }),
    onSuccess: (_, { modo }) => {
      toast.success(modo ? "Modo edição ativado" : "Modo edição desativado");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao alterar modo edição")),
  });

  const updatePedido = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiClienteAdmin.put(`/api/delivery/cliente/pedidos/${id}/editar`, data),
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar pedido")),
  });

  return { create, updateStatus, remove, toggleModoEdicao, updatePedido };
}
