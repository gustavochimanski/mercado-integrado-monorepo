// ================= Enums =================
export type PedidoStatus = "P" | "R" | "E" | "S" | "C"; // Pendente,  Em preparo, Entregue, Saiu para entrega, cancelado
export type TipoEntrega = "DELIVERY" | "RETIRADA";
export type OrigemPedido = "WEB" | "APP" | "PDV";
export type PagamentoMetodo = "DINHEIRO" | "CARTAO" | "PIX";
export type PagamentoGateway = "PIX_INTERNO" | "PAGSEGURO" | "STRIPE";

// ================= Item do pedido =================
export interface ItemPedido {
  id: number;
  produto_cod_barras: string;
  quantidade: number;
  preco_unitario: number;
  observacao?: string | null;
  produto_descricao_snapshot?: string | null;
  produto_imagem_snapshot?: string | null;
}

// ================= Pedido completo =================
export interface Pedido {
  id: number;
  status: PedidoStatus;
  telefone_cliente?: string | null;
  empresa_id: number;
  entregador_id?: number | null;
  endereco_id?: number | null;
  tipo_entrega: TipoEntrega;
  origem: OrigemPedido;
  subtotal: number;
  desconto: number;
  taxa_entrega: number;
  taxa_servico: number;
  valor_total: number;
  previsao_entrega?: string | null; // ISO string
  distancia_km?: number | null;
  observacao_geral?: string | null;
  troco_para?: number | null;
  cupom_id?: number | null;
  data_criacao: string; // ISO string
  data_atualizacao: string; // ISO string
  itens: ItemPedido[];
}

// ================= Request de finalizar pedido =================
export interface ItemPedidoRequest {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

export interface FinalizarPedidoRequest {
  empresa_id: number;
  telefone_cliente?: string; // será setado pelo token
  endereco_id: number;
  meio_pagamento_id: number;
  tipo_entrega?: TipoEntrega;
  origem?: OrigemPedido;
  observacao_geral?: string;
  cupom_id?: number;
  troco_para?: number;
  itens: ItemPedidoRequest[];
}

// ================= Request de confirmar pagamento =================
export interface ConfirmarPagamentoRequest {
  pedido_id: number;
  metodo?: PagamentoMetodo;
  gateway?: PagamentoGateway;
}
