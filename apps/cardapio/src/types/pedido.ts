// types/pedido.ts
export interface ItemPedido {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

export interface FinalizarPedidoPayload {
  telefone_cliente: string;
  empresa_id: number;
  meio_pagamento_id?: string;
  endereco_entrega_id?: string;
  observacao_geral?: string;
  itens: ItemPedido[];
}
