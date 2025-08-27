// Representa um item do pedido
export interface ItemPedido {
  codigoProduto: string; // ⚡ obrigatório e camelCase
  quantidade: number;
  observacao?: string;
}

// Payload enviado para finalizar um pedido
export interface FinalizarPedidoPayload {
  telefoneCliente: string;
  empresaId: number;
  meioPagamentoId?: string;
  enderecoEntregaId?: string;
  observacaoGeral?: string;
  itens: ItemPedido[];
}
