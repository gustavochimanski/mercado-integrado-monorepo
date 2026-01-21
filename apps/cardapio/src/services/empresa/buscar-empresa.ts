// @cardapio/services/empresa/buscar-empresa.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { EmpresaPublic } from "./types";

interface UseBuscarEmpresaOptions {
  enabled?: boolean;
  empresaId?: number | null;
}

/**
 * Hook para buscar dados públicos de uma empresa específica
 * Endpoint: GET /api/empresas/public/emp/lista?empresa_id={empresaId}
 * 
 * @param options - Opções incluindo empresaId
 * 
 * @example
 * ```tsx
 * const { data: empresa } = useBuscarEmpresa({ empresaId: 123 });
 * ```
 */
export function useBuscarEmpresa(options?: UseBuscarEmpresaOptions) {
  const { enabled = true, empresaId } = options ?? {};

  return useQuery<EmpresaPublic>({
    queryKey: ["empresa-public", empresaId],
    queryFn: async () => {
      const { data } = await api.get<EmpresaPublic[]>("/api/empresas/public/emp/lista", {
        params: { empresa_id: empresaId },
      });
      // A API retorna um array, pegamos o primeiro item
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      }
      throw new Error("Empresa não encontrada");
    },
    enabled: enabled && !!empresaId,
    staleTime: 60 * 60 * 1000, // 1 hora - empresa não muda frequentemente
    gcTime: 2 * 60 * 60 * 1000, // 2 horas
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3, // Tentar 3 vezes em caso de erro
  });
}

// Alias para manter compatibilidade
export const useQueryEmpresaPublic = (enabled = true, empresaId: number | undefined) => 
  useBuscarEmpresa({ enabled, empresaId: empresaId ?? null });

