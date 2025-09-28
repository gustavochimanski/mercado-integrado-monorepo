import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pedido } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";

/* Tipo de um pedido resumido */
export interface PedidoItem {
  id: number;
  cliente_nome: string;
  status: string;
  valor_total: number;
  data_criacao: string;
}

/* Tipos para confirmar pagamento */
export interface ConfirmarPagamentoRequest {
  meio_pagamento_id?: number;
  comprovante?: File | string;
  observacao_pagamento?: string;
}

/* Tipos para atualizar itens do pedido */
export interface ItemPedidoUpdate {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

export interface UpdateItensRequest {
  itens: ItemPedidoUpdate[];
}

// Listar Pedidos
export function usePedidos() {
  return useQuery<Pedido[]>({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<Pedido[]>("/delivery/cliente/pedidos/");
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Busca o pedido na lista em cache ao invés de fazer request individual
export function usePedidoById(pedidoId: number | null, opts?: { enabled?: boolean }) {  
  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      // Busca todos os pedidos e filtra o específico
      const { data } = await apiClienteAdmin.get<Pedido[]>("/delivery/cliente/pedidos/");
      const pedido = data.find(p => p.id === pedidoId);
      if (!pedido) throw new Error(`Pedido ${pedidoId} não encontrado`);
      return pedido;
    },
    enabled: !!pedidoId && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useMutatePedido() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos"] });
    qc.invalidateQueries({ queryKey: ["pedidos_search"] });
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiAdmin.put(`/api/delivery/pedidos/admin/status/${id}`, { status }),
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const toggleModoEdicao = useMutation({
    mutationFn: async ({ id, modo }: { id: number; modo: boolean }) => {
      return apiClienteAdmin.put(`/delivery/cliente/pedidos/${id}/modo-edicao`, { modo_edicao: modo });
    },
    onSuccess: (_, { modo }) => {
      toast.success(modo ? "Modo edição ativado" : "Modo edição desativado");
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err, "Erro ao alterar modo edição"));
    },
  });

  const updatePedido = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      apiClienteAdmin.put(`/delivery/cliente/pedidos/${id}/editar`, data),
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar pedido")),
  });

  const confirmarPagamento = useMutation({
    mutationFn: ({ id, dadosPagamento }: { id: number; dadosPagamento: ConfirmarPagamentoRequest }) =>
      apiClienteAdmin.post(`/delivery/cliente/pedidos/${id}/confirmar-pagamento`, dadosPagamento),
    onSuccess: () => {
      toast.success("Pagamento confirmado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao confirmar pagamento")),
  });

  const updateItens = useMutation({
    mutationFn: ({ id, itens }: { id: number; itens: ItemPedidoUpdate[] }) =>
      apiClienteAdmin.put(`/delivery/cliente/pedidos/${id}/itens`, { itens }),
    onSuccess: () => {
      toast.success("Itens do pedido atualizados com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar itens do pedido")),
  });

  return { updateStatus, toggleModoEdicao, updatePedido, confirmarPagamento, updateItens };
}
