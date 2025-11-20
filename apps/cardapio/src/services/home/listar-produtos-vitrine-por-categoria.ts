// @cardapio/services/home/listar-produtos-vitrine-por-categoria.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { VitrineComProdutosResponse } from "./types";

/**
 * Hook para listar produtos de vitrine por categoria
 * Endpoint: GET /api/cardapio/public/home/home/vitrine-por-categoria
 * 
 * @param codCategoria - Código da categoria
 * @param empresa_id - ID da empresa
 * 
 * @example
 * ```tsx
 * const { data: vitrines } = useListarProdutosVitrinePorCategoria(codCategoria, empresaId);
 * ```
 */
export function useListarProdutosVitrinePorCategoria(
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

