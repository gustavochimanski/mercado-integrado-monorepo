// @cardapio/services/categoria/buscar-categoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoriaMini } from "./types";

/**
 * Hook para buscar categoria por ID
 * Endpoint: GET /api/cardapio/admin/categorias/{catId}
 * 
 * @param catId - ID da categoria
 * @param opts - Opções (enabled)
 * 
 * @example
 * ```tsx
 * const { data: categoria } = useBuscarCategoria(categoriaId);
 * ```
 */
export function useBuscarCategoria(catId: number | null, opts?: { enabled?: boolean }) {
  const qc = useQueryClient();
  const seed = catId ? qc.getQueryData<CategoriaMini>(["categoria", catId]) : undefined;

  return useQuery<CategoriaMini>({
    queryKey: ["categoria", catId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<CategoriaMini>(`/api/cardapio/admin/categorias/${catId}`);
      return data;
    },
    initialData: seed,
    enabled: !!catId && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

