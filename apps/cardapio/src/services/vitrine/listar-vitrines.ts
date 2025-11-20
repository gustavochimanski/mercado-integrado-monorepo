// @cardapio/services/vitrine/listar-vitrines.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { VitrineOut } from "./types";

/**
 * Hook para listar vitrines filtrando por categoria
 * Endpoint: GET /api/cardapio/admin/vitrines/search
 * 
 * @param empresaId - ID da empresa (obrigatório)
 * @param codCategoria - Código da categoria (opcional)
 * 
 * @example
 * ```tsx
 * const { data: vitrines } = useListarVitrines(empresaId, codCategoria);
 * ```
 */
export function useListarVitrines(empresaId: number, codCategoria?: number) {
  return useQuery<VitrineOut[]>({
    queryKey: ["vitrines", empresaId, codCategoria],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (codCategoria) params.cod_categoria = codCategoria;

      const { data } = await apiAdmin.get<VitrineOut[]>(
        "/api/cardapio/admin/vitrines/search",
        { params }
      );
      return data;
    },
    enabled: !!empresaId,
    staleTime: 60_000, // 1 min
  });
}

