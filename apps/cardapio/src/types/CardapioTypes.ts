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
  label: string;
  imagem: string | null;
  href: string;
};
