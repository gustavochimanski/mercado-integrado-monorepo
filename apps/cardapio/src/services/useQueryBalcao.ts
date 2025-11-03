import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/* Tipos de pedidos de balcão */
export interface PedidoBalcaoItem {
  id: number;
  produto_cod_barras: string;
  quantidade: number;
  preco_unitario: number;
  observacao?: string | null;
  produto_descricao_snapshot?: string | null;
  produto_imagem_snapshot?: string | null;
}

export interface PedidoBalcao {
  id: number;
  numero_pedido: string;
  mesa_id?: number | null;
  cliente_id?: number | null;
  status: string;
  status_descricao: string;
  observacoes?: string | null;
  valor_total: number;
  itens: PedidoBalcaoItem[];
  created_at: string;
  updated_at: string;
}

export interface PedidoBalcaoCreate {
  mesa_id?: number | null;
  cliente_id?: number | null;
  observacoes?: string | null;
  itens: {
    produto_cod_barras: string;
    quantidade: number;
    observacao?: string;
  }[];
}

export interface ItemPedidoBalcao {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

export interface FecharContaBalcaoRequest {
  meio_pagamento_id?: number;
  troco_para?: number;
}

export interface HistoricoPedidoBalcao {
  id: number;
  pedido_id: number;
  cliente_id?: number | null;
  usuario_id?: number | null;
  tipo_operacao: string;
  status_anterior?: string | null;
  status_novo?: string | null;
  descricao?: string | null;
  observacoes?: string | null;
  ip_origem?: string | null;
  user_agent?: string | null;
  created_at: string;
  tipo_operacao_descricao: string;
  resumo_operacao: string;
  usuario?: string | null;
}

export interface HistoricoBalcaoResponse {
  pedido_id: number;
  historicos: HistoricoPedidoBalcao[];
}

/**
 * Listar Pedidos de Balcão Abertos
 * 
 * Endpoint: GET /api/balcao/admin/pedidos
 * 
 * Retorna lista de pedidos de balcão em aberto (não finalizados).
 * Autenticação: Requer Authorization: Bearer {token}
 */
export function useQueryPedidosBalcaoAbertos() {
  return useQuery<PedidoBalcao[]>({
    queryKey: ["pedidos_balcao", "abertos"],
    queryFn: async () => {
      const { data } = await apiAdmin.get("/api/balcao/admin/pedidos");
      return data as PedidoBalcao[];
    },
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}

/**
 * Listar Pedidos de Balcão Finalizados
 * 
 * Endpoint: GET /api/balcao/admin/pedidos/finalizados?data=YYYY-MM-DD
 * 
 * Retorna lista de pedidos de balcão finalizados em uma data específica.
 * Autenticação: Requer Authorization: Bearer {token}
 * 
 * @param data - Data no formato YYYY-MM-DD (padrão: hoje)
 */
export function useQueryPedidosBalcaoFinalizados(data?: string) {
  const hoje = data || new Date().toISOString().split('T')[0];
  
  return useQuery<PedidoBalcao[]>({
    queryKey: ["pedidos_balcao", "finalizados", hoje],
    queryFn: async () => {
      const { data } = await apiAdmin.get(
        `/api/balcao/admin/pedidos/finalizados?data=${hoje}`
      );
      return data as PedidoBalcao[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Buscar Pedido de Balcão por ID
 * 
 * Endpoint: GET /api/balcao/admin/pedidos/{pedido_id}
 * 
 * Retorna pedido de balcão completo com todos os dados.
 * Autenticação: Requer Authorization: Bearer {token}
 * 
 * @param pedidoId - ID do pedido
 * @param enabled - Se deve buscar ou não (padrão: true se pedidoId existir)
 */
export function useQueryPedidoBalcaoById(pedidoId: number | null, enabled: boolean = true) {
  return useQuery<PedidoBalcao>({
    queryKey: ["pedido_balcao", pedidoId],
    queryFn: async () => {
      if (!pedidoId) throw new Error("Pedido ID é obrigatório");
      const { data } = await apiAdmin.get(`/api/balcao/admin/pedidos/${pedidoId}`);
      return data as PedidoBalcao;
    },
    enabled: enabled && !!pedidoId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Obter Histórico de Pedido de Balcão
 * 
 * Endpoint: GET /api/balcao/admin/pedidos/{pedido_id}/historico?limit=100
 * 
 * Retorna histórico completo de todas as operações realizadas no pedido.
 * Autenticação: Requer Authorization: Bearer {token}
 * 
 * @param pedidoId - ID do pedido
 * @param limit - Limite de registros (padrão: 100, máximo: 500)
 */
export function useQueryHistoricoPedidoBalcao(pedidoId: number | null, limit: number = 100) {
  return useQuery<HistoricoBalcaoResponse>({
    queryKey: ["historico_balcao", pedidoId, limit],
    queryFn: async () => {
      if (!pedidoId) throw new Error("Pedido ID é obrigatório");
      const { data } = await apiAdmin.get(
        `/api/balcao/admin/pedidos/${pedidoId}/historico?limit=${limit}`
      );
      return data as HistoricoBalcaoResponse;
    },
    enabled: !!pedidoId,
    staleTime: 60 * 1000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

/**
 * Hooks para mutações de pedidos de balcão
 */
export function useMutateBalcao() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["pedidos_balcao"] });
    qc.invalidateQueries({ queryKey: ["pedido_balcao"] });
    qc.invalidateQueries({ queryKey: ["historico_balcao"] });
  };

  /**
   * Criar Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos
   * 
   * Cria um novo pedido de balcão com status PENDENTE.
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const criar = useMutation({
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

  /**
   * Adicionar Item ao Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/itens
   * 
   * Adiciona um novo item ao pedido de balcão.
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const adicionarItem = useMutation({
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

  /**
   * Remover Item do Pedido de Balcão
   * 
   * Endpoint: DELETE /api/balcao/admin/pedidos/{pedido_id}/itens/{item_id}
   * 
   * Remove um item do pedido de balcão.
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const removerItem = useMutation({
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

  /**
   * Confirmar Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/confirmar
   * 
   * Confirma o pedido de balcão (status PENDENTE → CONFIRMADO).
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const confirmar = useMutation({
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

  /**
   * Cancelar Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/cancelar
   * 
   * Cancela o pedido de balcão (status atual → CANCELADO).
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const cancelar = useMutation({
    mutationFn: async (pedidoId: number) => {
      const response = await apiAdmin.post(`/api/balcao/admin/pedidos/${pedidoId}/cancelar`);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido cancelado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao cancelar pedido")),
  });

  /**
   * Fechar Conta do Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/fechar-conta
   * 
   * Fecha a conta do pedido de balcão (status PRONTO → ENTREGUE).
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const fecharConta = useMutation({
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

  /**
   * Reabrir Pedido de Balcão
   * 
   * Endpoint: POST /api/balcao/admin/pedidos/{pedido_id}/reabrir
   * 
   * Reabre um pedido de balcão finalizado ou cancelado.
   * Autenticação: Requer Authorization: Bearer {token}
   */
  const reabrir = useMutation({
    mutationFn: async (pedidoId: number) => {
      const response = await apiAdmin.post(`/api/balcao/admin/pedidos/${pedidoId}/reabrir`);
      return response.data as PedidoBalcao;
    },
    onSuccess: () => {
      toast.success("Pedido reaberto com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao reabrir pedido")),
  });

  return {
    criar,
    adicionarItem,
    removerItem,
    confirmar,
    cancelar,
    fecharConta,
    reabrir,
  };
}

