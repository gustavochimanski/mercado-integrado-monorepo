// @cardapio/services/adicionais/listar-adicionais.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { AdicionalResponse } from "./types";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para listar todos os adicionais de uma empresa
 * Endpoint: GET /api/cadastros/admin/adicionais?empresa_id={empresa_id}&apenas_ativos={apenas_ativos}
 * 
 * @param empresa_id - ID da empresa
 * @param apenas_ativos - Se deve retornar apenas adicionais ativos (padrão: true)
 * @param opts - Opções adicionais (enabled)
 * 
 * @example
 * ```tsx
 * const { data: adicionais } = useListarAdicionais(empresaId, true);
 * ```
 */
export function useListarAdicionais(
  empresa_id: number,
  apenas_ativos: boolean = true,
  opts?: { enabled?: boolean }
) {
  const key = ["adicionais", empresa_id, apenas_ativos] as const;

  return useQuery<AdicionalResponse[]>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse[]>(
        `${BASE}?empresa_id=${empresa_id}&apenas_ativos=${apenas_ativos}`
      );
      return data;
    },
    enabled: (opts?.enabled ?? true) && !!empresa_id,
    staleTime: 5 * 60 * 1000,
  });
}

