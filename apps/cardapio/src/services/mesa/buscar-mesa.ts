// @cardapio/services/mesa/buscar-mesa.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useQuery } from "@tanstack/react-query";
import type { MesaOut } from "./types";

/**
 * Hook para buscar uma mesa específica por ID
 * Endpoint: GET /api/mesas/admin/mesas/{mesaId}
 * 
 * @param mesaId - ID da mesa
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data: mesa } = useBuscarMesa(mesaId);
 * ```
 */
export function useBuscarMesa(mesaId: number | null, enabled: boolean = true) {
  return useQuery<MesaOut>({
    queryKey: ["mesa", mesaId],
    queryFn: async () => {
      if (!mesaId) throw new Error("Mesa ID é obrigatório");
      const { data } = await apiClienteAdmin.get(`/api/mesas/admin/mesas/${mesaId}`);
      return data as MesaOut;
    },
    enabled: enabled && !!mesaId,
    staleTime: 30 * 1000,
  });
}

