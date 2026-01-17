// ================= Enums =================
export type PedidoStatus = "P" | "R" | "E" | "S" | "C" | "I" | "D" | "X" | "A"; // Pendente, Em preparo, Entregue, Saiu para entrega, Cancelado, Pendente Impressão, Editado, EM_EDICAO, Aguardando Pagamento
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

// ================= Estrutura de produtos do pedido (com complementos) =================
export interface AdicionalPedido {
  adicional_id: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  total: number;
}

export interface ComplementoPedido {
  complemento_id: number;
  complemento_nome: string;
  obrigatorio: boolean;
  quantitativo: boolean;
  total: number;
  adicionais: AdicionalPedido[];
}

export interface ItemProdutoPedido {
  item_id: number;
  produto_cod_barras: string;
  descricao: string;
  imagem?: string | null;
  quantidade: number;
  preco_unitario: number;
  observacao?: string | null;
  complementos: ComplementoPedido[];
}

export interface ReceitaPedido {
  item_id: number;
  receita_id: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
  observacao?: string | null;
  complementos: ComplementoPedido[];
}

export interface ProdutosPedido {
  itens: ItemProdutoPedido[];
  receitas: ReceitaPedido[];
  combos: any[];
}

// ================= Pedido completo =================
export interface Pedido {
  endereco_snapshot: any;
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
  meio_pagamento_nome: string;
  cliente_nome: string;
  tipo_pedido?: TipoPedidoGateway;
  numero_pedido?: string;
  status_descricao?: string;
  produtos?: ProdutosPedido; // Estrutura completa com receitas, combos e complementos
}

// ================= Request de finalizar pedido =================
// NOVO: Estrutura de Complementos
export interface ItemAdicionalComplementoRequest {
  adicional_id: number;
  quantidade: number; // Usado apenas se complemento.quantitativo = true
}

export interface ItemComplementoRequest {
  complemento_id: number;
  adicionais: ItemAdicionalComplementoRequest[];
}

// LEGADO: Mantido para compatibilidade (deprecated)
export interface ItemAdicionalRequest {
  adicional_id: number;
  quantidade: number;
}

export interface ItemPedidoRequest {
  produto_cod_barras: string;
  quantidade: number;
  observacao?: string;
  complementos?: ItemComplementoRequest[]; // NOVO: Complementos agrupados
  // REMOVIDO: adicionais (não use mais)
  // REMOVIDO: adicionais_ids (não use mais)
}

export interface ComboPedidoRequest {
  combo_id: number;
  quantidade?: number; // Default: 1 (legado)
  complementos?: ItemComplementoRequest[]; // NOVO: Complementos agrupados
  // REMOVIDO: adicionais (não use mais)
}

export interface ReceitaPedidoRequest {
  receita_id: number;
  quantidade: number;
  observacao?: string;
  complementos?: ItemComplementoRequest[]; // NOVO: Complementos agrupados
  // REMOVIDO: adicionais (não use mais)
  // REMOVIDO: adicionais_ids (não use mais)
}

// ================= Formato unificado de itens do pedido =================
export interface PedidoItemUnificado {
  tipo: "PRODUTO" | "COMBO" | "RECEITA";
  produto_cod_barras?: string; // se tipo = PRODUTO
  combo_id?: number;           // se tipo = COMBO
  receita_id?: number;         // se tipo = RECEITA
  quantidade: number;
  observacao?: string;
  complementos?: ItemComplementoRequest[]; // NOVO: Complementos agrupados
  // REMOVIDO: adicionais (não use mais)
}

export type TipoPedidoGateway = "DELIVERY" | "MESA" | "BALCAO";
export type TipoPedidoCheckout = TipoPedidoGateway;

export interface ProdutosPedidoRequest {
  itens: ItemPedidoRequest[]; // Produtos individuais (com produto_cod_barras)
  combos?: ComboPedidoRequest[]; // Combos
  receitas?: ReceitaPedidoRequest[]; // Receitas
}

export interface FinalizarPedidoRequest {
  empresa_id?: number | null;
  tipo_pedido: TipoPedidoCheckout;
  telefone_cliente?: string; // será setado pelo token
  cliente_id?: number | null;
  endereco_id?: number | null;
  mesa_codigo?: string | null;
  num_pessoas?: number | null;
  meio_pagamento_id?: number | null;
  meios_pagamento?: MeioPagamentoParcialRequest[] | null;
  tipo_entrega?: TipoEntrega;
  origem?: OrigemPedido;
  observacao_geral?: string;
  cupom_id?: number | null;
  troco_para?: number | null;
  produtos: ProdutosPedidoRequest; // Produtos englobando itens, combos e receitas
}

// ================= Request de confirmar pagamento =================
export interface ConfirmarPagamentoRequest {
  pedido_id: number;
  metodo?: PagamentoMetodo;
  gateway?: PagamentoGateway;
}

// ================= Gateway Orquestrador =================
export interface MeioPagamentoParcialRequest {
  meio_pagamento_id: number;
  valor: number;
}

export interface CheckoutGatewayRequest {
  tipo_pedido: TipoPedidoGateway;
  empresa_id: number;
  itens: ItemPedidoRequest[]; // Apenas produtos (com produto_cod_barras)
  
  // Campos comuns (todos os tipos)
  observacao_geral?: string | null;
  cliente_id?: number | null;
  
  // Campos específicos para DELIVERY
  endereco_id?: number | null;
  meio_pagamento_id?: number | null;
  meios_pagamento?: MeioPagamentoParcialRequest[] | null;
  tipo_entrega?: TipoEntrega | "RETIRADA";
  origem?: OrigemPedido | "BALCAO";
  cupom_id?: number | null;
  troco_para?: number | null;
  
  // Campos específicos para MESA/BALCAO
  mesa_codigo?: string | null;
  num_pessoas?: number | null;
}

export interface CheckoutGatewayResponse<T = any> {
  tipo_pedido: TipoPedidoGateway;
  success: boolean;
  message: string | null;
  data: T;
}

// ================= Gateway - Editar Pedido =================
export interface EditarPedidoGatewayRequest {
  observacao_geral?: string | null;
  meio_pagamento_id?: number | null;
  endereco_id?: number | null;
  cupom_id?: number | null;
  troco_para?: number | null;
  tipo_entrega?: TipoEntrega | null;
  [key: string]: any; // Permite campos adicionais
}

export interface EditarPedidoGatewayResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
}

// ================= Gateway - Atualizar Item =================
export interface AtualizarItemGatewayRequest {
  acao: "adicionar" | "atualizar" | "remover";
  id?: number | null;
  produto_cod_barras?: string | null;
  quantidade?: number | null;
  observacao?: string | null;
}

export interface AtualizarItemGatewayResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
}

// ================= Gateway - Atualizar Status =================
export interface AtualizarStatusGatewayRequest {
  status?: string | null; // Opcional se usar query parameter
  motivo?: string | null;
  observacoes?: string | null;
  ip_origem?: string | null;
  user_agent?: string | null;
}

export interface AtualizarStatusGatewayResponse<T = any> {
  success: boolean;
  message: string | null;
  data: T;
}