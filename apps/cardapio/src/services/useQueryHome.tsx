// src/services/useQueryHome.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../app/api/api";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { toast } from "sonner";

export interface VitrineComProdutosResponse {
  id: number;
  titulo: string;
  slug: string;
  href_categoria: string
  ordem: number;
  is_home: boolean;
  cod_categoria: number;
  produtos: ProdutoEmpMini[];
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
      const { data } = await api.get<CategoriaPorSlugResponse>("/delivery/home/categoria", {
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
      const { data } = await api.get<HomeResponse>("/delivery/home", { params });
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
      const { data } = await api.get<VitrineComProdutosResponse[]>("/delivery/home/vitrine-por-categoria", { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
