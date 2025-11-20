// @cardapio/services/categoria/buscar-categorias.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { CategoriaSearchItem } from "./types";
import { useDebounced } from "./utils";

/**
 * Hook para buscar categorias com filtro
 * Endpoint: GET /api/cardapio/admin/categorias/search
 * 
 * @param q - Termo de busca
 * @param opts - Opções de busca
 * 
 * @example
 * ```tsx
 * const { data: categorias } = useBuscarCategorias("pizza", { limit: 30 });
 * ```
 */
export function useBuscarCategorias(
  q: string,
  opts: {
    limit?: number;
    offset?: number;
    enabled?: boolean;
    minLength?: number;
    debounceMs?: number;
    allowEmpty?: boolean;
  } = {}
) {
  const {
    limit = 30,
    offset = 0,
    enabled = true,
    minLength = 2,
    debounceMs = 300,
    allowEmpty = false,
  } = opts;

  const qDeb = useDebounced(q ?? "", debounceMs);
  const hasTerm = qDeb.trim().length >= minLength;
  const canRun = enabled && (allowEmpty || hasTerm);

  return useQuery<CategoriaSearchItem[]>({
    queryKey: ["categorias_search", allowEmpty ? qDeb : hasTerm ? qDeb : "", limit, offset],
    queryFn: async () => {
      const params: Record<string, any> = { limit, offset };
      if (allowEmpty || hasTerm) params.q = qDeb.trim();
      const { data } = await apiAdmin.get<CategoriaSearchItem[]>(
        "/api/cardapio/admin/categorias/search",
        { params }
      );
      return data;
    },
    enabled: canRun,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (old) => old,
  });
}

