/**
 * Item de pedido formatado para impressão
 */
export interface ItemPedidoImpressao {
  descricao: string
  quantidade: number
  preco: number
  observacao: string
}

/**
 * Dados da empresa para impressão no cabeçalho
 */
export interface DadosEmpresaImpressao {
  nome: string
  cnpj: string
  endereco: string
  telefone: string
}

/**
 * Dados completos do pedido formatados para impressão
 */
export interface PedidoImpressao {
  numero: number
  status: string
  cliente: string
  telefone_cliente: string
  itens: ItemPedidoImpressao[]
  subtotal: number
  desconto: number
  taxa_entrega: number
  taxa_servico: number
  total: number
  tipo_pagamento: string
  troco: number
  observacao_geral: string
  endereco: string
  data_criacao: string // ISO 8601 format
  empresa: DadosEmpresaImpressao
}

/**
 * Resposta da API ao marcar pedido como impresso
 */
export interface RespostaImpressao {
  sucesso: boolean
  mensagem: string
  numero_pedido?: number | null
  timestamp?: string | null
}
