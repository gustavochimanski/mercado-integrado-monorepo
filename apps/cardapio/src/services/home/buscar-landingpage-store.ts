// @cardapio/services/home/buscar-landingpage-store.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { LandingPageStoreResponse } from "./types";

/**
 * Hook para buscar vitrines da Landing Page Store
 * Endpoint: GET /api/cardapio/public/home/landingpage-store
 */
export function useBuscarLandingpageStore(empresa_id: number | null, isHome: boolean = false) {
  return useQuery<LandingPageStoreResponse, Error>({
    queryKey: ["landingpage-store", empresa_id, { isHome }],
    enabled: !!empresa_id,
    queryFn: async () => {
      const params: Record<string, any> = { empresa_id };
      if (typeof isHome === "boolean") params.is_home = isHome;
      const { data } = await api.get<LandingPageStoreResponse>("/api/cardapio/public/home/landingpage-store", {
        params,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

