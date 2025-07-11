export type ProdutoMini = {
  id: number;
  descricao: string;
  imagem: string | null;
  cod_categoria: number;
};

export type ProdutoEmpMini = {
  empresa: number;
  cod_barras: string;
  preco_venda: number;
  produto: ProdutoMini;
  subcategoria_id: number
};
