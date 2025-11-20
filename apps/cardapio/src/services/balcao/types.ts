// @cardapio/services/balcao/types.ts

export interface PedidoBalcaoItem {
  id: number;
  produto_cod_barras: string;
  quantidade: number;
  preco_unitario: number;
  observacao?: string | null;
  produto_descricao_snapshot?: string | null;
  produto_imagem_snapshot?: string | null;
}

export interface PedidoBalcao {
  id: number;
  numero_pedido: string;
  mesa_id?: number | null;
  cliente_id?: number | null;
  status: string;
  status_descricao: string;
  observacoes?: string | null;
  valor_total: number;
  itens: PedidoBalcaoItem[];
  created_at: string;
  updated_at: string;
}

export interface PedidoBalcaoCreate {
  mesa_id?: number | null;
  cliente_id?: number | null;
  observacoes?: string | null;
  itens: {
    produto_cod_barras: string;
    quantidade: number;
    observacao?: string;
  }[];
}

export interface ItemPedidoBalcao {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
}

export interface FecharContaBalcaoRequest {
  meio_pagamento_id?: number;
  troco_para?: number;
}

export interface HistoricoPedidoBalcao {
  id: number;
  pedido_id: number;
  cliente_id?: number | null;
  usuario_id?: number | null;
  tipo_operacao: string;
  status_anterior?: string | null;
  status_novo?: string | null;
  descricao?: string | null;
  observacoes?: string | null;
  ip_origem?: string | null;
  user_agent?: string | null;
  created_at: string;
  tipo_operacao_descricao: string;
  resumo_operacao: string;
  usuario?: string | null;
}

export interface HistoricoBalcaoResponse {
  pedido_id: number;
  historicos: HistoricoPedidoBalcao[];
}

