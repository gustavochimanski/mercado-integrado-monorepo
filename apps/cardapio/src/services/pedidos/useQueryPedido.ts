import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Pedido } from "@cardapio/types/pedido";
import type { EditarPedidoRequest } from "../../api/models/EditarPedidoRequest";
import type { ItemPedidoEditar as ItemPedidoEditarPayload } from "../../api/models/ItemPedidoEditar";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import {
  editarPedidoCliente,
  atualizarItemPedidoCliente,
} from "@cardapio/services/pedidos/checkout-finalizar-pedido";
import { listarPedidosCliente } from "@cardapio/services/pedidos/listar-pedidos-client";

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
 * Lista pedidos do cliente usando a API unificada de Pedidos.
 *
 * Endpoint: GET /api/pedidos/client/
 *
 * Retorna lista de pedidos do cliente (DELIVERY, MESA e BALCAO) mesclados.
 * Requer autenticação via `X-Super-Token` (token do cliente).
 */
export function usePedidos(skip: number = 0, limit: number = 50) {
  return useQuery<Pedido[]>({
    queryKey: ["pedidos", skip, limit],
    queryFn: async () => {
      return await listarPedidosCliente(skip, limit);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca o pedido na lista em cache ao invés de fazer request individual.
 *
 * Endpoint base: GET /api/pedidos/client/.
 * Busca até 200 pedidos e filtra o ID desejado, evitando round-trips extras.
 */
export function usePedidoById(pedidoId: number | null, opts?: { enabled?: boolean }) {  
  return useQuery({
    queryKey: ["pedido", pedidoId],
    queryFn: async () => {
      const pedidos = await listarPedidosCliente(0, 200); // busca via API de cliente
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
   * [DESATIVADO] Ativa/desativa modo de edição e gerencia status do pedido.
   * 
   * ⚠️ ATENÇÃO: Os endpoints de modo-edicao e atualização de status foram desativados.
   * A alteração de status de pedido é permitida apenas em endpoints de admin.
   * 
   * Esta função agora apenas simula o comportamento localmente sem fazer chamadas ao backend.
   * 
   * @deprecated Endpoints desativados. Use endpoints admin para alterar status.
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
      // Endpoints desativados - apenas simula comportamento local
      // Não faz chamadas ao backend
      console.warn(
        `[DESATIVADO] Modo edição ${modo ? "ativado" : "desativado"} para pedido ${id}. ` +
        `Endpoints de alteração de status foram desativados. Use endpoints admin.`
      );
      
      // Retorna um objeto vazio para manter compatibilidade
      return { id } as any;
    },
    onSuccess: (_, { modo }) => {
      toast.warning(
        modo 
          ? "Modo edição ativado localmente (backend desativado)" 
          : "Modo edição desativado localmente (backend desativado)"
      );
      invalidate();
    },
    onError: (err: unknown) => {
      toast.error(extractErrorMessage(err, "Erro ao alterar modo edição"));
    },
  });

  /**
   * Converte ação do formato do modal (EDITAR/REMOVER/MANTER) para o formato esperado pela API
   */
  const converterAcaoParaApi = (acao: string): "adicionar" | "atualizar" | "remover" => {
    if (acao === "REMOVER") return "remover";
    if (acao === "EDITAR") return "atualizar";
    if (acao === "adicionar" || acao === "atualizar" || acao === "remover") {
      return acao as "adicionar" | "atualizar" | "remover";
    }
    return "atualizar"; // padrão
  };

  /**
   * Atualiza pedido usando a API unificada de Pedidos (cliente)
   *
   * Reaproveita a API exclusiva do cliente para alterações de pedidos.
   * 
   * Lógica:
   * - Se `data.itens` for um array: cada item é processado individualmente via PUT /api/pedidos/client/{id}/itens
   * - Caso contrário: usa PUT /api/pedidos/client/{id}/editar para dados gerais do pedido
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
          
          const itemPayload: ItemPedidoEditarPayload = {
            acao: converterAcaoParaApi(item.acao),
            id: item.id ?? null,
            produto_cod_barras: item.produto_cod_barras ?? null,
            quantidade: item.quantidade ?? null,
            observacao: item.observacao ?? null,
          };
          
          await atualizarItemPedidoCliente(id, itemPayload);
        }
        
        // Retorna o último resultado ou sucesso
        return { success: true };
      }
      
      // Caso contrário, usa o endpoint de editar para dados gerais
      const payload = { ...data } as EditarPedidoRequest;
      delete (payload as any).itens; // Remove itens se existir
      
      const response = await editarPedidoCliente(id, payload);
      return response;
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
   * Atualiza itens do pedido usando a API unificada de Pedidos (cliente)
   * 
   * Endpoint: PUT /api/pedidos/client/{pedido_id}/itens
   *
   * Usa apenas a API do cliente (headers `X-Super-Token`).
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
      
      // Converte ItemPedidoEditar para o payload esperado pela API
      const itemPayload: ItemPedidoEditarPayload = {
        acao: converterAcaoParaApi(item.acao),
        id: item.id ?? null,
        produto_cod_barras: item.produto_cod_barras ?? null,
        quantidade: item.quantidade ?? null,
        observacao: item.observacao ?? null,
      };
      
      // Executa atualização direta na API do cliente
      const response = await atualizarItemPedidoCliente(id, itemPayload);
      return response;
    },
    onSuccess: () => {
      toast.success("Itens do pedido atualizados com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err, "Erro ao atualizar itens do pedido")),
  });

  return { toggleModoEdicao, updatePedido, confirmarPagamento, updateItens };
}
