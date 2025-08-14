// src/services/useQueryHome.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "../app/api/api";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";
import { extractErrorMessage } from "../lib/extractErrorMessage";

// ====== TIPOS ALINHADOS AO BACK ======
export interface CategoriaMini {
  id: number;
  slug: string;
  parent_id?: number | null;
  descricao: string;
  posicao: number;
  imagem?: string | null;
  label: string;
  href: string;
  slug_pai: string | null; // sempre string|null
}

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

// useQueryHome.ts
export function useHome(empresa_id: number, isHome: boolean) {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home", empresa_id, { isHome }],
    enabled: !!empresa_id,
    queryFn: async () => {
      const params: Record<string, any> = { empresa_id };
      if (typeof isHome === "boolean") params.is_home = isHome;
      const { data } = await api.get<HomeResponse>("/api/delivery/home", { params });
      return data;
    },
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
      const { data } = await api.get<VitrineComProdutosResponse[]>("/api/delivery/home/vitrine-por-categoria", { params });
      return data;
    },
  });
}
