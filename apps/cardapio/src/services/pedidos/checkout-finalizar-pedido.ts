import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { FinalizarPedidoRequest } from "@cardapio/types/pedido";
import type { PreviewCheckoutResponse } from "../../api/models/PreviewCheckoutResponse";
import type { PedidoResponse } from "../../api/models/PedidoResponse";
import type { PedidoMesaOut } from "../../api/models/PedidoMesaOut";
import type { PedidoBalcaoOut } from "../../api/models/PedidoBalcaoOut";
import type { EditarPedidoRequest } from "../../api/models/EditarPedidoRequest";
import type { ItemPedidoEditar } from "../../api/models/ItemPedidoEditar";
import type { ModoEdicaoRequest } from "../../api/models/ModoEdicaoRequest";
import type { AtualizarStatusGatewayRequest } from "@cardapio/types/pedido";

const CLIENT_PEDIDOS_BASE_PATH = "/api/pedidos/client";

export function ensureBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("URL da API não configurada.");
  }
  return baseUrl;
}

export function ensureClientToken(): string {
  const token = getTokenCliente();
  if (!token || !token.trim()) {
    throw new Error("Token de cliente não encontrado. Cliente não autenticado.");
  }
  return token.trim();
}

export function buildClientHeaders(includeJson: boolean = true): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Super-Token": ensureClientToken(),
  };

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

/**
 * Calcula o preview do checkout sem criar o pedido.
 * 
 * Endpoint: POST /api/pedidos/client/checkout/preview
 * 
 * Calcula valores do pedido (subtotal, taxas, desconto, total) sem criar
 * o pedido no banco de dados.
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 */
export async function previewCheckoutCliente(
  payload: FinalizarPedidoRequest
): Promise<PreviewCheckoutResponse> {
  try {
    const response = await axios.post<PreviewCheckoutResponse>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/checkout/preview`,
      payload,
      { headers: buildClientHeaders() }
    );

    if (response.status !== 200) {
      throw new Error("Erro ao calcular preview do checkout");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao calcular preview do checkout");
  }
}

/**
 * Finaliza o checkout e cria o pedido no banco de dados.
 * 
 * Endpoint: POST /api/pedidos/client/checkout
 * 
 * Cria o pedido completo no banco de dados com todos os dados fornecidos.
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 * 
 * Retorna o pedido criado (DELIVERY, MESA ou BALCAO conforme tipo_pedido)
 */
export async function finalizarCheckoutCliente(
  payload: FinalizarPedidoRequest
): Promise<PedidoResponse | PedidoMesaOut | PedidoBalcaoOut> {
  try {
    const response = await axios.post<PedidoResponse | PedidoMesaOut | PedidoBalcaoOut>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/checkout`,
      payload,
      { headers: buildClientHeaders() }
    );

    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Erro ao finalizar checkout");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao finalizar checkout");
  }
}


/**
 * Edita informações gerais do pedido.
 * 
 * Endpoint: PUT /api/pedidos/client/{pedido_id}/editar
 * 
 * Permite editar: meio_pagamento_id, endereco_id, cupom_id,
 * observacao_geral, troco_para, etc.
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 */
export async function editarPedidoCliente(
  pedidoId: number,
  dados: EditarPedidoRequest
): Promise<PedidoResponse> {
  try {
    const response = await axios.put<PedidoResponse>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/${pedidoId}/editar`,
      dados,
      { headers: buildClientHeaders() }
    );

    if (response.status !== 200) {
      throw new Error("Erro ao editar pedido");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao editar pedido");
  }
}

/**
 * Adiciona, atualiza ou remove itens de um pedido.
 * 
 * Endpoint: PUT /api/pedidos/client/{pedido_id}/itens
 * 
 * Ações disponíveis:
 * - adicionar: Adiciona novo item ao pedido
 * - atualizar: Atualiza item existente (requer id)
 * - remover: Remove item do pedido (requer id)
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 */
export async function atualizarItemPedidoCliente(
  pedidoId: number,
  item: ItemPedidoEditar
): Promise<PedidoResponse> {
  try {
    const response = await axios.put<PedidoResponse>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/${pedidoId}/itens`,
      item,
      { headers: buildClientHeaders() }
    );

    if (response.status !== 200) {
      throw new Error("Erro ao atualizar itens do pedido");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao atualizar itens do pedido");
  }
}

/**
 * [DESATIVADO] Altera o modo de edição do pedido.
 * 
 * Endpoint: PUT /api/pedidos/client/{pedido_id}/modo-edicao
 * 
 * ⚠️ ATENÇÃO: Este endpoint foi desativado no backend e sempre retorna 403.
 * A alteração de status de pedido é permitida apenas em endpoints de admin.
 * 
 * @deprecated Use endpoints admin para alterar status de pedidos.
 */
export async function alterarModoEdicaoCliente(
  pedidoId: number,
  modoEdicao: boolean
): Promise<PedidoResponse> {
  throw new Error(
    "Endpoint desativado. Alteração de status de pedido é permitida apenas em endpoints de admin."
  );
}

/**
 * [DESATIVADO] Atualiza o status do pedido (cliente).
 * 
 * Endpoint: PUT /api/pedidos/client/{pedido_id}/status?novo_status={status}
 * 
 * ⚠️ ATENÇÃO: Clientes não podem alterar status diretamente; apenas admin pode.
 * Use o endpoint de admin: PUT /api/pedidos/admin/{pedido_id}/status?novo_status={status}
 * 
 * @deprecated Use endpoints admin para alterar status de pedidos.
 */
export async function atualizarStatusPedidoCliente(
  pedidoId: number,
  status: string,
  dados?: Omit<AtualizarStatusGatewayRequest, "status">
): Promise<PedidoResponse> {
  throw new Error(
    "Clientes não podem alterar status de pedidos. Use endpoints admin para esta operação."
  );
}

