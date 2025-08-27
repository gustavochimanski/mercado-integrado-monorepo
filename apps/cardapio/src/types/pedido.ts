// Representa um item do pedido
export interface ItemPedidoRequest {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

// Payload enviado para finalizar um pedido
export interface FinalizarPedidoRequest {
  telefone_cliente?: string;
  empresa_id: number;
  endereco_id?: number;
  tipo_entrega?: "DELIVERY" | "RETIRADA"; // TipoEntregaEnum
  origem?: "WEB" | "APP"; // OrigemPedidoEnum
  observacao_geral?: string;
  cupom_id?: number;
  troco_para?: number;
  meio_pagamento_id: number
  itens: ItemPedidoRequest[];
}
