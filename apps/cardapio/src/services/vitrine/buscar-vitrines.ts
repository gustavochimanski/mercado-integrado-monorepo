// @cardapio/services/vitrine/buscar-vitrines.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import { useDebounced } from "./utils";
import type { VitrineSearchItem } from "./types";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "./utils";

interface UseBuscarVitrinesOptions {
  codCategoria?: number | null;
  isHome?: boolean | null;
  limit?: number;
  offset?: number;
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook para buscar vitrines com filtros
 * Endpoint: GET /api/cardapio/admin/vitrines/search
 * 
 * @param q - Termo de busca
 * @param opts - Opções de filtro e paginação
 * 
 * @example
 * ```tsx
 * const { data: vitrines } = useBuscarVitrines("pizza", { codCategoria: 1 });
 * ```
 */
export function useBuscarVitrines(
  q: string,
  opts?: UseBuscarVitrinesOptions
) {
  const {
    codCategoria = null,
    isHome = null,
    limit = 30,
    offset = 0,
    debounceMs = 300,
    enabled,
  } = opts ?? {};

  const empresaId = getEmpresaId();
  const landingpageTrue = useLandingpageTrue();
  const qDeb = useDebounced(q, debounceMs);

  const hasCat   = codCategoria != null;
  const hasQuery = typeof qDeb === "string" && qDeb.trim().length > 0;

  return useQuery<VitrineSearchItem[]>({
    queryKey: ["vitrines_search", empresaId, qDeb, codCategoria, isHome, limit, offset, { landingpageTrue }],
    queryFn: async () => {
      const params: Record<string, any> = { empresa_id: empresaId, limit, offset };
      if (hasQuery) params.q = qDeb.trim();
      if (codCategoria != null) params.cod_categoria = codCategoria;
      if (isHome != null) params.is_home = isHome;
      if (landingpageTrue) params.landingpage_true = true;
      const { data } = await apiAdmin.get<VitrineSearchItem[]>("/api/cardapio/admin/vitrines/search", { params });
      return data;
    },
    enabled: (enabled ?? (hasCat || hasQuery)) && empresaId > 0,
    staleTime: 10 * 60 * 1000,
  });
}

