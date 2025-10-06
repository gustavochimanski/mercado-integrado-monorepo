// // ================= Enums =================
// export type PedidoStatus = "P" | "R" | "E" | "S" | "C" // Pendente, Em preparo, Entregue, Saiu para entrega, cancelado
// export type TipoEntrega = "DELIVERY" | "RETIRADA"
// export type OrigemPedido = "WEB" | "APP" | "PDV"
// export type PagamentoMetodo = "DINHEIRO" | "CARTAO" | "PIX"
// export type PagamentoGateway = "PIX_INTERNO" | "PAGSEGURO" | "STRIPE"

// export type PedidoKanban = {
//   id: number
//   status: "P" | "R" | "S" | "E" | "C"
//   telefone_cliente?: string | null
//   nome_cliente?: string | null // novo campo
//   valor_total: number
//   data_criacao: string
//   endereco_cliente?: string | null // novo campo
//   meio_pagamento_descricao: string | null
//   observacao_geral: string | null
//   motoboy?: string | null // Adicionando campo motoboy para filtros
//   empresa_id?: number | null // Adicionando empresa_id para filtros
// }



// ================= Enums =================
export type PedidoStatus = "P" | "R" | "E" | "S" | "C" // Pendente, Em preparo, Entregue, Saiu para entrega, cancelado
export type TipoEntrega = "DELIVERY" | "RETIRADA"
export type OrigemPedido = "WEB" | "APP" | "PDV"
export type PagamentoMetodo = "DINHEIRO" | "CARTAO" | "PIX"
export type PagamentoGateway = "PIX_INTERNO" | "PAGSEGURO" | "STRIPE"

export interface Endereco {
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  ponto_referencia?: string
  latitude?: number
  longitude?: number
  is_principal?: boolean
  id?: number
  endereco_formatado?: string
  rua?: string
  // Campos adicionais da API de busca
  codigo_estado?: string
  distrito?: string
  pais?: string
}

export interface EnderecoSearchResponse {
  estado: string
  codigo_estado: string
  cidade: string
  bairro: string | null
  distrito: string | null
  logradouro: string
  numero: string | null
  cep: string
  pais: string
  latitude: number
  longitude: number
  endereco_formatado: string
  // Campos de compatibilidade
  rua?: string
}

export type PedidoKanban = {
  id: number
  status: PedidoStatus
  telefone_cliente?: string | null
  nome_cliente?: string | null
  valor_total: number
  data_criacao: string
  endereco?: string | null
  meio_pagamento_id?: number | null // Alterado de meio_pagamento_descricao para meio_pagamento_id
  observacao_geral?: string | null
  motoboy?: string | null // Mapeia para entregador.nome
  empresa_id?: number | null
    meio_pagamento_descricao?: string | null // Alterado de meio_pagamento_descricao para meio_pagamento_id

}