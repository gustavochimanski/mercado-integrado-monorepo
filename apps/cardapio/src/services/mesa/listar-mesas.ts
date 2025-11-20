// @cardapio/services/mesa/listar-mesas.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery } from "@tanstack/react-query";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import type { MesaListOut } from "./types";

/**
 * Hook para listar todas as mesas (incluindo ocupadas)
 * Endpoint: GET /api/mesas/admin/mesas?ativa=true
 * 
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: mesas } = useListarMesas();
 * ```
 */
export function useListarMesas(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaListOut[]>({
    queryKey: ["mesas", "todas", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas", {
        params: {
          ativa: true,
        },
      });
      return data as MesaListOut[];
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
}

