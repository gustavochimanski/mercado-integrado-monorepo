// src/services/useQueryHome.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../app/api/api";
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
  empresa_id: number;
  cod_barras: string;
  preco_venda: number;
  vitrine_id: number | null;
  disponivel: boolean;
  produto: {
    cod_barras: string;
    descricao: string;
    imagem: string | null;
    cod_categoria: number | null;
    ativo: boolean;
    unidade_medida: string | null;
  };
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
  combos: ComboMiniDTO[] | null;  // ⬅️ NOVO
  receitas: ReceitaMiniDTO[] | null;  // ⬅️ NOVO
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

export function useCategoriaPorSlug(empresaId?: number | null, slug?: string | null) {
  return useQuery<CategoriaPorSlugResponse>({
    queryKey: ["categoria-por-slug", empresaId, slug],
    queryFn: async () => {
      const { data } = await api.get<CategoriaPorSlugResponse>("/api/cardapio/public/home/home/categoria", {
        params: { empresa_id: empresaId, slug },
      });
      return data;
    },
    enabled: !!empresaId && !!slug,
    staleTime: 5 * 60 * 1000,
  });
}


// useQueryHome.ts
export function useHome(empresa_id: number | null, isHome: boolean) {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home", empresa_id, { isHome }],
    enabled: !!empresa_id,
    queryFn: async () => {
      const params: Record<string, any> = { empresa_id };
      if (typeof isHome === "boolean") params.is_home = isHome;
      const { data } = await api.get<HomeResponse>("/api/cardapio/public/home/home", { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProdutosVitrinePorCategoria(
  codCategoria: number,
  empresa_id: number
) {
  return useQuery<VitrineComProdutosResponse[], Error>({
    queryKey: ["produtos-vitrine-categoria", empresa_id, codCategoria],
    enabled: !!empresa_id && !!codCategoria,
    queryFn: async () => {
      const params: Record<string, any> = { cod_categoria: codCategoria, empresa_id };
      const { data } = await api.get<VitrineComProdutosResponse[]>("/api/cardapio/public/home/home/vitrine-por-categoria", { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
