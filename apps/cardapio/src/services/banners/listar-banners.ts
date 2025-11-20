// @cardapio/services/banners/listar-banners.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery } from "@tanstack/react-query";
import type { Banner } from "./types";

/**
 * Hook para listar todos os banners
 * Endpoint: GET /api/cadastros/public/parceiros/banners
 * 
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: banners } = useListarBanners();
 * ```
 */
export function useListarBanners(enabled = true) {
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<Banner[]>("/api/cadastros/public/parceiros/banners");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

