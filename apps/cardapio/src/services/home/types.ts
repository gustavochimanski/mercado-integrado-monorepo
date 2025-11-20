// @cardapio/services/home/types.ts
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

// Tipos para combos e receitas conforme documentação
export interface ComboMiniDTO {
  id: number;
  empresa_id: number;
  titulo: string;
  descricao: string;
  preco_total: number;
  imagem: string | null;
  ativo: boolean;
  vitrine_id: number | null;
}

export interface ReceitaMiniDTO {
  id: number;
  empresa_id: number;
  nome: string;
  descricao: string;
  preco_venda: number;
  imagem: string | null;
  vitrine_id: number | null;
  disponivel: boolean;
  ativo: boolean;
}

export interface VitrineComProdutosResponse {
  id: number;
  titulo: string;
  slug: string;
  href_categoria: string | null;
  ordem: number;
  is_home: boolean;
  cod_categoria: number | null;
  produtos: ProdutoEmpMini[];
  combos: ComboMiniDTO[] | null;
  receitas: ReceitaMiniDTO[] | null;
}

export interface HomeResponse {
  categorias: CategoriaMini[];
  vitrines: VitrineComProdutosResponse[];
}

export type CategoryPageResponse = {
  categoria: CategoriaMini;
  subcategorias: CategoriaMini[];
  vitrines: VitrineComProdutosResponse[];
};

export type CategoriaMini = {
  id: number;
  slug: string;
  parent_id: number | null;
  descricao: string;
  posicao: number;
  imagem: string | null;
  label: string;
  href: string;
  slug_pai: string | null;
};

export type Vitrine = {
  id: number;
  titulo: string;
  is_home: boolean;
  produtos: any[]; // tipar conforme seu ProdutoEmpMini
};

export type CategoriaPorSlugResponse = {
  categoria: CategoriaMini | null;
  subcategorias: CategoriaMini[];
  vitrines: VitrineComProdutosResponse[];        // vitrines da própria categoria
  vitrines_filho: VitrineComProdutosResponse[];  // vitrine "primeira" de cada subcategoria
};

