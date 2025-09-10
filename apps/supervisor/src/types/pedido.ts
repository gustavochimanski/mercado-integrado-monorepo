// // ================= Enums =================
// export type PedidoStatus = "P" | "R" | "E" | "S" | "C"; // Pendente,  Em preparo, Entregue, Saiu para entrega, cancelado
// export type TipoEntrega = "DELIVERY" | "RETIRADA";
// export type OrigemPedido = "WEB" | "APP" | "PDV";
// export type PagamentoMetodo = "DINHEIRO" | "CARTAO" | "PIX";
// export type PagamentoGateway = "PIX_INTERNO" | "PAGSEGURO" | "STRIPE";

// export type PedidoKanban = {
//   id: number;
//   status: "P" | "R" | "S" | "E" | "C";
//   telefone_cliente?: string | null;
//   nome_cliente?: string | null;   // novo campo
//   valor_total: number;
//   data_criacao: string;
//   endereco_cliente?: string | null;     // novo campo
//   meio_pagamento_descricao: string | null
//   observacao_geral: string | null
// };

// ================= Enums =================
export type PedidoStatus = "P" | "R" | "E" | "S" | "C" // Pendente, Em preparo, Entregue, Saiu para entrega, cancelado
export type TipoEntrega = "DELIVERY" | "RETIRADA"
export type OrigemPedido = "WEB" | "APP" | "PDV"
export type PagamentoMetodo = "DINHEIRO" | "CARTAO" | "PIX"
export type PagamentoGateway = "PIX_INTERNO" | "PAGSEGURO" | "STRIPE"

export type PedidoKanban = {
  id: number
  status: "P" | "R" | "S" | "E" | "C"
  telefone_cliente?: string | null
  nome_cliente?: string | null // novo campo
  valor_total: number
  data_criacao: string
  endereco_cliente?: string | null // novo campo
  meio_pagamento_descricao: string | null
  observacao_geral: string | null
  motoboy?: string | null // Adicionando campo motoboy para filtros
  empresa_id?: number | null // Adicionando empresa_id para filtros
}
