// types/pedido.ts
export interface ItemPedido {
  produto_id: string;
  quantidade: number;
  observacao?: string;
}

export interface FinalizarPedidoPayload {
  cliente_id: string;
  empresa_id: number;
  meio_pagamento_id?: string;
  endereco_entrega_id?: string;
  observacao_geral?: string;
  itens: ItemPedido[];
}
