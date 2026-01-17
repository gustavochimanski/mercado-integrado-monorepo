import axios from "axios";
import { ensureBaseUrl, buildClientHeaders } from "./checkout-finalizar-pedido";
import type { Pedido } from "@cardapio/types/pedido";
import type {
  PedidoResponseSimplificado,
  PedidoMesaOut,
  PedidoBalcaoOut,
} from "@cardapio/api";

const CLIENT_PEDIDOS_BASE_PATH = "/api/pedidos/client";

type TipoPedidoUnificado = "DELIVERY" | "MESA" | "BALCAO";

interface PedidoUnificadoResponse {
  tipo_pedido: TipoPedidoUnificado;
  criado_em: string;
  atualizado_em: string | null;
  status_codigo: string;
  status_descricao: string;
  numero_pedido: string;
  valor_total: number;
  delivery?: PedidoResponseSimplificado | null;
  mesa?: PedidoMesaOut | null;
  balcao?: PedidoBalcaoOut | null;
}

function calcularSubtotal(
  itens: Array<{ preco_unitario: number; quantidade: number }> | undefined
): number {
  if (!Array.isArray(itens) || itens.length === 0) {
    return 0;
  }
  return itens.reduce(
    (acc, item) => acc + item.preco_unitario * item.quantidade,
    0
  );
}

function mapPedidoDelivery(
  entry: PedidoUnificadoResponse,
  delivery: PedidoResponseSimplificado,
  entryAny?: any
): Pedido {
  const empresaId = (delivery as any)?.empresa_id ?? 0;
  // A estrutura produtos está em entry.delivery (que é o objeto completo retornado pela API)
  // entryAny.delivery contém o objeto completo retornado pela API (não apenas o tipo simplificado)
  // O tipo PedidoResponseSimplificado não inclui produtos, mas a API retorna
  const entryDelivery = entryAny?.delivery as any;
  const deliveryAny = delivery as any;
  
  // Pegar produtos diretamente de entry.delivery (que tem a estrutura completa)
  // ou de delivery (caso esteja lá também)
  const produtos = entryDelivery?.produtos ?? deliveryAny?.produtos ?? undefined;
  
  return {
    id: delivery.id,
    status: delivery.status as any,
    cliente_nome: delivery.cliente_nome || "Cliente",
    telefone_cliente: delivery.cliente_telefone ?? null,
    empresa_id: empresaId,
    entregador_id: null,
    endereco_id: undefined,
    tipo_entrega: "DELIVERY",
    origem: "WEB",
    subtotal: delivery.subtotal,
    desconto: delivery.desconto,
    taxa_entrega: delivery.taxa_entrega,
    taxa_servico: delivery.taxa_servico,
    valor_total: delivery.valor_total,
    previsao_entrega: delivery.previsao_entrega ?? null,
    distancia_km: null,
    observacao_geral: delivery.observacao_geral ?? null,
    troco_para: delivery.troco_para ?? null,
    cupom_id: null,
    data_criacao: entry.criado_em || delivery.data_criacao,
    data_atualizacao:
      entry.atualizado_em ?? delivery.data_atualizacao ?? entry.criado_em,
    itens: delivery.itens || [],
    meio_pagamento_nome: delivery.meio_pagamento_nome || "Não informado",
    endereco_snapshot: delivery.endereco_snapshot ?? null,
    tipo_pedido: entry.tipo_pedido,
    numero_pedido: entry.numero_pedido || String(delivery.id),
    status_descricao: entry.status_descricao,
    produtos,
  };
}

function mapPedidoMesa(
  entry: PedidoUnificadoResponse,
  mesa: PedidoMesaOut
): Pedido {
  const itens = mesa.itens ?? [];
  const subtotal = calcularSubtotal(itens);
  return {
    id: mesa.id,
    status: entry.status_codigo as any,
    cliente_nome: `Mesa ${mesa.mesa_id ?? ""}`.trim() || "Pedido de Mesa",
    telefone_cliente: null,
    empresa_id: (mesa as any)?.empresa_id ?? 0,
    entregador_id: null,
    endereco_id: null,
    tipo_entrega: "RETIRADA",
    origem: "PDV",
    subtotal,
    desconto: 0,
    taxa_entrega: 0,
    taxa_servico: 0,
    valor_total: mesa.valor_total ?? entry.valor_total,
    previsao_entrega: null,
    distancia_km: null,
    observacao_geral: mesa.observacoes ?? null,
    troco_para: null,
    cupom_id: null,
    data_criacao: mesa.created_at ?? entry.criado_em,
    data_atualizacao:
      mesa.updated_at ?? entry.atualizado_em ?? mesa.created_at ?? entry.criado_em,
    itens,
    meio_pagamento_nome: "Não informado",
    endereco_snapshot: null,
    tipo_pedido: entry.tipo_pedido,
    numero_pedido: entry.numero_pedido,
    status_descricao: entry.status_descricao,
  };
}

function mapPedidoBalcao(
  entry: PedidoUnificadoResponse,
  balcao: PedidoBalcaoOut
): Pedido {
  const itens = balcao.itens ?? [];
  const subtotal = calcularSubtotal(itens);
  return {
    id: balcao.id,
    status: entry.status_codigo as any,
    cliente_nome: "Pedido Balcão",
    telefone_cliente: null,
    empresa_id: (balcao as any)?.empresa_id ?? 0,
    entregador_id: null,
    endereco_id: null,
    tipo_entrega: "RETIRADA",
    origem: "PDV",
    subtotal,
    desconto: 0,
    taxa_entrega: 0,
    taxa_servico: 0,
    valor_total: balcao.valor_total ?? entry.valor_total,
    previsao_entrega: null,
    distancia_km: null,
    observacao_geral: balcao.observacoes ?? null,
    troco_para: null,
    cupom_id: null,
    data_criacao: balcao.created_at ?? entry.criado_em,
    data_atualizacao:
      balcao.updated_at ??
      entry.atualizado_em ??
      balcao.created_at ??
      entry.criado_em,
    itens,
    meio_pagamento_nome: "Não informado",
    endereco_snapshot: null,
    tipo_pedido: entry.tipo_pedido,
    numero_pedido: entry.numero_pedido,
    status_descricao: entry.status_descricao,
  };
}

function normalizePedido(entry: PedidoUnificadoResponse): Pedido | null {
  // Fazer cast para any para acessar propriedades não tipadas (como produtos)
  const entryAny = entry as any;
  
  if (entry.tipo_pedido === "DELIVERY" && entry.delivery) {
    // entry.delivery pode ter produtos mesmo que o tipo não inclua
    return mapPedidoDelivery(entry, entry.delivery, entryAny);
  }

  if (entry.tipo_pedido === "MESA" && entry.mesa) {
    return mapPedidoMesa(entry, entry.mesa);
  }

  if (entry.tipo_pedido === "BALCAO" && entry.balcao) {
    return mapPedidoBalcao(entry, entry.balcao);
  }

  if (entry.delivery) return mapPedidoDelivery(entry, entry.delivery, entryAny);
  if (entry.mesa) return mapPedidoMesa(entry, entry.mesa);
  if (entry.balcao) return mapPedidoBalcao(entry, entry.balcao);

  return null;
}

/**
 * Lista todos os pedidos do cliente (DELIVERY, MESA e BALCAO) mesclados.
 * 
 * Endpoint: GET /api/pedidos/client/
 * 
 * Query Parameters:
 * - skip: Número de registros para pular (padrão: 0)
 * - limit: Limite de registros (padrão: 50, máx: 200)
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 * 
 * Retorna lista unificada de pedidos com dados completos de cada tipo.
 */
export async function listarPedidosCliente(
  skip: number = 0,
  limit: number = 50
): Promise<Pedido[]> {
  try {
    const response = await axios.get<PedidoUnificadoResponse[]>(
      `${ensureBaseUrl()}${CLIENT_PEDIDOS_BASE_PATH}/`,
      {
        headers: buildClientHeaders(false),
        params: { skip, limit },
      }
    );

    if (response.status !== 200) {
      throw new Error("Erro ao listar pedidos do cliente");
    }

    const pedidosNormalizados = response.data
      .map(normalizePedido)
      .filter((pedido): pedido is Pedido => pedido !== null);

    return pedidosNormalizados;
  } catch (error: any) {
    if (error.response?.data) {
      throw error;
    }

    throw new Error(error.message || "Erro inesperado ao listar pedidos");
  }
}
