// @cardapio/services/adicionais/buscar-adicional.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { AdicionalResponse } from "./types";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para buscar um adicional por ID
 * Endpoint: GET /api/cadastros/admin/adicionais/{adicional_id}
 * 
 * @param adicional_id - ID do adicional
 * @param opts - Opções adicionais (enabled)
 * 
 * @example
 * ```tsx
 * const { data: adicional } = useBuscarAdicional(adicionalId);
 * ```
 */
export function useBuscarAdicional(
  adicional_id: number | null,
  opts?: { enabled?: boolean }
) {
  const qc = useQueryClient();
  const seed = adicional_id 
    ? qc.getQueryData<AdicionalResponse>(["adicional", adicional_id])
    : undefined;

  return useQuery<AdicionalResponse>({
    queryKey: ["adicional", adicional_id],
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse>(
        `${BASE}/${adicional_id}`
      );
      return data;
    },
    initialData: seed,
    enabled: !!adicional_id && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

