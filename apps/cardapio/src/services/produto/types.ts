// @cardapio/services/produto/types.ts

export type ProdutoListItem = {
  cod_barras: string;
  descricao: string;
  imagem?: string | null;
  preco_venda: number;
  custo?: number | null;
  cod_categoria: number;
  label_categoria: string;
  disponivel: boolean;
  exibir_delivery: boolean;
};

export type ProdutosPaginadosResponse = {
  data: ProdutoListItem[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
};

export type CreateProdutoInput = {
  cod_empresa: number;
  cod_barras: string;
  descricao: string;
  cod_categoria: number;
  preco_venda: number | string;
  custo?: number | string | null;
  vitrine_id?: number | null;
  data_cadastro?: string | Date | null;
  imagem?: File | null;
};

export type UpdateProdutoInput = Omit<CreateProdutoInput, "cod_barras"> & {
  cod_barras: string; // no path
};

