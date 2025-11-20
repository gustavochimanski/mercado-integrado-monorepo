// @cardapio/services/home/buscar-categoria-por-slug.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { CategoriaPorSlugResponse } from "./types";

/**
 * Hook para buscar categoria por slug
 * Endpoint: GET /api/cardapio/public/home/home/categoria
 * 
 * @param empresaId - ID da empresa
 * @param slug - Slug da categoria
 * 
 * @example
 * ```tsx
 * const { data: categoria } = useBuscarCategoriaPorSlug(empresaId, "pizzas");
 * ```
 */
export function useBuscarCategoriaPorSlug(empresaId?: number | null, slug?: string | null) {
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

