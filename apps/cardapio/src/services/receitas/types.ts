// @cardapio/services/receitas/types.ts
export interface ReceitaApiResponse {
  id: number;
  empresa_id: number;
  nome: string;
  descricao: string;
  preco_venda: string;
  custo_total: string;
  imagem: string | null;
  ativo: boolean;
  disponivel: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReceitaListItem {
  id: number;
  receita_id: number;
  cod_barras?: string; // Pode não existir na resposta
  descricao: string;
  nome: string;
  preco_venda: number;
  imagem: string | null;
  ativo: boolean;
  empresa_id: number;
  disponivel: boolean;
}

