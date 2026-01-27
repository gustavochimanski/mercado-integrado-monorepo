// @cardapio/services/home/buscar-home.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { HomeResponse } from "./types";

/**
 * Hook para buscar dados da home
 * Endpoint: GET /api/cardapio/public/home
 * 
 * @param empresa_id - ID da empresa
 * @param isHome - Se deve buscar apenas vitrines marcadas como home
 * 
 * @example
 * ```tsx
 * const { data: home } = useBuscarHome(empresaId, true);
 * ```
 */
export function useBuscarHome(empresa_id: number | null, isHome: boolean) {
  return useQuery<HomeResponse, Error>({
    queryKey: ["home", empresa_id, { isHome }],
    enabled: !!empresa_id,
    queryFn: async () => {
      const params: Record<string, any> = { empresa_id };
      if (typeof isHome === "boolean") params.is_home = isHome;
      const { data } = await api.get<HomeResponse>("/api/cardapio/public/home", { params });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

