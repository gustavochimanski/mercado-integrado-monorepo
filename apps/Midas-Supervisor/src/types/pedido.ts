/**
 * Status disponíveis para um pedido
 * A - AGUARDANDO/ABERTO
 * P - PENDENTE
 * I - CONFIRMADO
 * R - PREPARANDO
 * S - PRONTO
 * E - SAIU_PARA_ENTREGA
 * C - ENTREGUE
 * D - CANCELADO
 * X - (Status especial)
 */
export type PedidoStatus = 'P' | 'I' | 'R' | 'S' | 'E' | 'C' | 'D' | 'X' | 'A'

/**
 * Pedido simplificado para visualização no Kanban
 */
export interface Pedido {
  id: number
  status: PedidoStatus
  nome_cliente: string
  telefone_cliente: string
  endereco: string
  valor_total: number
  data_pedido: string
  empresa_id: number
  empresa_nome?: string
  entregador_nome?: string
}

/**
 * Endereço selecionado do pedido
 */
export interface EnderecoSelecionado {
  logradouro: string
  numero?: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  ponto_referencia?: string
}

/**
 * Pedido com detalhes completos
 */
export interface PedidoDetalhado extends Pedido {
  itens: PedidoItem[]
  cliente?: {
    nome: string
    telefone: string
  }
  endereco: string | {
    endereco_selecionado?: EnderecoSelecionado
  }
  entregador?: {
    id: number
    nome: string
  }
  observacoes?: string
  meio_pagamento?: {
    id: number
    nome: string
  }
  cupom?: {
    id: number
    codigo: string
    desconto: number
  }
  troco_para?: number
}

/**
 * Item de um pedido
 */
export interface PedidoItem {
  id: number
  produto_nome: string
  produto_cod_barras: string
  quantidade: number
  preco_unitario: number
  observacao?: string
}
