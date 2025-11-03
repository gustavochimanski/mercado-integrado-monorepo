import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pedido, EditarPedidoGatewayRequest, AtualizarItemGatewayRequest, AtualizarStatusGatewayRequest } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { 
  editarPedidoGateway, 
  atualizarItemPedidoGateway, 
  atualizarStatusPedidoGateway,
  listarPedidosGateway,
  alterarModoEdicaoGateway
} from "@cardapio/services/useGatewayCheckout";

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

export interface ItemPedidoEditar {
  id?: number | null;
  produto_cod_barras?: string | null;
  quantidade?: number | null;
  observacao?: string | null;
  acao: string; // "adicionar", "atualizar" ou "remover"
}

export interface UpdateItensRequest {
  itens: ItemPedidoUpdate[];
}

/**
 * Listar Pedidos - Usa Gateway Orquestrador
 * 
 * Endpoint: GET /api/gateway/pedidos
 * 
 * Retorna lista de pedidos do cliente com dados simplificados incluindo nome do meio de pagamento.
 * Autenticação: Requer X-Super-Token no header
 */
export function usePedidos(skip: number = 0, limit: number = 50) {
  return useQuery<Pedido[]>({
    queryKey: ["pedidos", skip, limit],
    queryFn: async () => {
      // Usa o gateway orquestrador
      return await listarPedidosGateway(skip, limit);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca o pedido na lista em cache ao invés de fazer request individual
 * 
 * Usa Gateway Orquestrador: GET /api/gateway/pedidos
 * 
 * Busca todos os pedidos e filtra o específico pelo ID.
 * Otimizado para evitar requisições desnecessárias.
 */
export function usePedidoById(pedidoId: number | null, opts?: { enabled?: boolean }) {  
  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      // Busca todos os pedidos usando gateway e filtra o específico
      const pedidos = await listarPedidosGateway(0, 200); // Busca até 200 pedidos para encontrar o específico
      const pedido = pedidos.find(p => p.id === pedidoId);
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
    qc.invalidateQueries({ queryKey: ["pedido"] });
  };

  /**
   * Atualiza status do pedido usando o Gateway Orquestrador
   * 
   * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/status
   * 
   * Detecta automaticamente se é ADMIN ou CLIENT baseado nos tokens disponíveis:
   * - ADMIN: Token Bearer → pode atualizar status de qualquer pedido
   * - CLIENT: X-Super-Token → apenas pode atualizar status de seus próprios pedidos
   * 
   * Suporta dois modos:
   * 1. Atualização simples: apenas status via query parameter
   * 2. Atualização com histórico: status + motivo + observacoes + ip_origem + user_agent via body
   */
  const updateStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      dadosHistorico 
    }: { 
      id: number; 
      status: string;
      dadosHistorico?: Omit<AtualizarStatusGatewayRequest, "status">;
    }) => {
      // Usa o gateway orquestrador que detecta automaticamente admin/client
      const response = await atualizarStatusPedidoGateway(id, status, dadosHistorico);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Status do pedido atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  /**
   * Ativa/desativa modo de edição e gerencia status do pedido
   * 
   * Usa Gateway Orquestrador: PUT /api/gateway/pedidos/{pedido_id}/modo-edicao
   * 
   * - Ao ativar (modo=true): muda status para "X" (EM_EDICAO) via endpoint de status
   * - Ao desativar (modo=false): pode voltar status para o anterior se fornecido
   * 
   * Autenticação: Requer X-Super-Token no header (cliente)
   */
  const toggleModoEdicao = useMutation({
    mutationFn: async ({ 
      id, 
      modo, 
      statusAnterior 
    }: { 
      id: number; 
      modo: boolean;
      statusAnterior?: string;
    }) => {
      // Ao ativar modo edição, muda status para "X" (EM_EDICAO)
      if (modo) {
        // Primeiro muda o status para X usando gateway (pode ser admin ou client)
        await atualizarStatusPedidoGateway(id, "X");
        // Depois ativa o modo edição usando gateway (client)
        return await alterarModoEdicaoGateway(id, true);
      } else {
        // Ao desativar modo edição, volta status para o anterior se fornecido
        if (statusAnterior) {
          await atualizarStatusPedidoGateway(id, statusAnterior);
        }
        return await alterarModoEdicaoGateway(id, false);
      }
    },
    onSuccess: (_, { modo }) => {
      toast.success(modo ? "Modo edição ativado" : "Modo edição desativado");
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err, "Erro ao alterar modo edição"));
    },
  });

  /**
   * Converte ação do formato do modal (EDITAR/REMOVER/MANTER) para formato do gateway (atualizar/remover/adicionar)
   */
  const converterAcaoParaGateway = (acao: string): "adicionar" | "atualizar" | "remover" => {
    if (acao === "REMOVER") return "remover";
    if (acao === "EDITAR") return "atualizar";
    if (acao === "adicionar" || acao === "atualizar" || acao === "remover") {
      return acao as "adicionar" | "atualizar" | "remover";
    }
    return "atualizar"; // padrão
  };

  /**
   * Atualiza pedido usando o Gateway Orquestrador
   * 
   * Detecta automaticamente se é ADMIN ou CLIENT baseado nos tokens disponíveis:
   * - ADMIN: Token Bearer → pode editar qualquer pedido
   * - CLIENT: X-Super-Token → apenas pode editar seus próprios pedidos
   * 
   * Lógica:
   * - Se `data.itens` for um array: cada item é processado individualmente via PUT /api/gateway/pedidos/{id}/itens
   * - Caso contrário: usa PUT /api/gateway/pedidos/{id}/editar para dados gerais do pedido
   * 
   * Itens marcados como "MANTER" são ignorados.
   */
  const updatePedido = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      // Se tiver itens como array, processa cada item individualmente
      if (data.itens && Array.isArray(data.itens)) {
        const itensArray = data.itens as ItemPedidoEditar[];
        
        // Processa cada item sequencialmente
        for (const item of itensArray) {
          // Ignora itens marcados como MANTER (sem alteração)
          if (item.acao === "MANTER") continue;
          
          const gatewayItem: AtualizarItemGatewayRequest = {
            acao: converterAcaoParaGateway(item.acao),
            id: item.id ?? null,
            produto_cod_barras: item.produto_cod_barras ?? null,
            quantidade: item.quantidade ?? null,
            observacao: item.observacao ?? null,
          };
          
          await atualizarItemPedidoGateway(id, gatewayItem);
        }
        
        // Retorna o último resultado ou sucesso
        return { success: true };
      }
      
      // Caso contrário, usa o endpoint de editar para dados gerais
      const gatewayData = { ...data } as EditarPedidoGatewayRequest;
      delete (gatewayData as any).itens; // Remove itens se existir
      
      const response = await editarPedidoGateway(id, gatewayData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar pedido")),
  });

  const confirmarPagamento = useMutation({
    mutationFn: ({ id, dadosPagamento }: { id: number; dadosPagamento: ConfirmarPagamentoRequest }) =>
      apiClienteAdmin.post(`/api/delivery/client/pagamentos/${id}/confirmar`, dadosPagamento),
    onSuccess: () => {
      toast.success("Pagamento confirmado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao confirmar pagamento")),
  });

  /**
   * Atualiza itens do pedido usando o Gateway Orquestrador
   * 
   * Endpoint: PUT /api/gateway/pedidos/{pedido_id}/itens
   * 
   * Detecta automaticamente se é ADMIN ou CLIENT baseado nos tokens disponíveis:
   * - ADMIN: Token Bearer → pode atualizar itens de qualquer pedido
   * - CLIENT: X-Super-Token → apenas pode atualizar itens de seus próprios pedidos
   * 
   * Ações: adicionar, atualizar, remover
   * Itens marcados como "MANTER" são ignorados.
   */
  const updateItens = useMutation({
    mutationFn: async ({ id, item }: { id: number; item: ItemPedidoEditar }) => {
      // Ignora itens marcados como MANTER (sem alteração)
      if (item.acao === "MANTER") {
        return { success: true, message: "Item sem alterações" };
      }
      
      // Converte ItemPedidoEditar para AtualizarItemGatewayRequest
      const gatewayItem: AtualizarItemGatewayRequest = {
        acao: converterAcaoParaGateway(item.acao),
        id: item.id ?? null,
        produto_cod_barras: item.produto_cod_barras ?? null,
        quantidade: item.quantidade ?? null,
        observacao: item.observacao ?? null,
      };
      
      // Usa o gateway orquestrador que detecta automaticamente admin/client
      const response = await atualizarItemPedidoGateway(id, gatewayItem);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Itens do pedido atualizados com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar itens do pedido")),
  });

  return { updateStatus, toggleModoEdicao, updatePedido, confirmarPagamento, updateItens };
}
