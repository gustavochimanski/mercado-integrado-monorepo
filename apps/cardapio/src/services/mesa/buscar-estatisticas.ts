// @cardapio/services/mesa/buscar-estatisticas.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery } from "@tanstack/react-query";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import type { MesaStatsOut } from "./types";

/**
 * Hook para buscar estatísticas de mesas
 * Endpoint: GET /api/mesas/admin/mesas/stats
 * 
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: stats } = useBuscarEstatisticasMesas();
 * ```
 */
export function useBuscarEstatisticasMesas(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaStatsOut>({
    queryKey: ["mesas", "stats", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas/stats");
      return data as MesaStatsOut;
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000,
  });
}

