export type AdicionalMini = {
  id: number;
  descricao: string;
  preco: number;
  obrigatorio?: boolean;
  permite_multipla_escolha?: boolean;
  ordem?: number;
  ativo?: boolean;
};

export type ProdutoMini = {
  id?: number; // Opcional para compatibilidade
  descricao: string;
  imagem: string | null;
  cod_categoria: number | null; // Pode ser null conforme API
  adicionais?: AdicionalMini[] | null; // Adicionais dentro do produto
};

export type ProdutoEmpMini = {
  empresa?: number; // Opcional para compatibilidade com API que retorna empresa_id
  empresa_id?: number; // Aceita ambos para compatibilidade
  cod_barras: string;
  preco_venda: number;
  produto: ProdutoMini;
  subcategoria_id?: number;
  adicionais?: AdicionalMini[] | null; // Adicionais no nível do produto-empresa (legado)
};
