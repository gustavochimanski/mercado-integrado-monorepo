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

const CLIENT_PEDIDOS_BASE_PATH = "/api/cardapio/client/pedidos";

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

export async function alterarModoEdicaoCliente(
  pedidoId: number,
  modoEdicao: boolean
): Promise<PedidoResponse> {
  try {
    const body: ModoEdicaoRequest = {
      modo_edicao: modoEdicao,
    };

    const response = await axios.put<PedidoResponse>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/${pedidoId}/modo-edicao`,
      body,
      { headers: buildClientHeaders() }
    );

    if (response.status !== 200) {
      throw new Error("Erro ao alterar modo de edição");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao alterar modo de edição");
  }
}

export async function atualizarStatusPedidoCliente(
  pedidoId: number,
  status: string,
  dados?: Omit<AtualizarStatusGatewayRequest, "status">
): Promise<PedidoResponse> {
  try {
    const hasBody = dados && Object.keys(dados).length > 0;
    const headers = buildClientHeaders(hasBody);
    let url = `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/${pedidoId}/status`;
    let body: Record<string, unknown> | undefined;

    if (hasBody) {
      body = {
        status,
        ...dados,
      };
    } else {
      url += `?novo_status=${encodeURIComponent(status)}`;
    }

    const response = await axios.put<PedidoResponse>(url, body, { headers });

    if (response.status !== 200) {
      throw new Error("Erro ao atualizar status do pedido");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao atualizar status do pedido");
  }
}

