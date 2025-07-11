import { ProdutoEmpMini } from "./Produtos";

export type VitrineConfig = {
  id: number;
  cod_empresa: number;
  titulo: string;
  slug: string;
  ordem: number;
  cod_categoria: number;
};

export type CategoriaComProdutos = {
  id: number;
  slug: string;
  slug_pai: string | null;
  descricao: string;
  imagem: string | null;
  destacar_em_slug: string | null;
  href: string;
  produtos: ProdutoEmpMini[];
  vitrines?: VitrineConfig[]; // aparece só na categoria raiz
};
