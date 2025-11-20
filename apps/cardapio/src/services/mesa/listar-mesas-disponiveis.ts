// @cardapio/services/mesa/listar-mesas-disponiveis.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery } from "@tanstack/react-query";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import type { MesaListOut } from "./types";

/**
 * Hook para listar mesas disponíveis (apenas mesas ativas e disponíveis)
 * Endpoint: GET /api/mesas/admin/mesas?ativa=true
 * 
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: mesas } = useListarMesasDisponiveis();
 * ```
 */
export function useListarMesasDisponiveis(enabled: boolean = true) {
  const empresaId = getEmpresaId();
  
  return useQuery<MesaListOut[]>({
    queryKey: ["mesas", "disponiveis", empresaId],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get("/api/mesas/admin/mesas", {
        params: {
          ativa: true, // Apenas mesas ativas
        },
      });
      
      // Filtrar apenas mesas disponíveis (status "D")
      const mesas: MesaListOut[] = data || [];
      return mesas.filter((m) => m.status === "D");
    },
    enabled: enabled && !!empresaId,
    staleTime: 30 * 1000, // 30 segundos
    refetchOnWindowFocus: true,
  });
}

