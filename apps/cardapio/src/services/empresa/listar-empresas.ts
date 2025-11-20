// @cardapio/services/empresa/listar-empresas.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { EmpresaDisponivel } from "./types";

interface UseListarEmpresasOptions {
  enabled?: boolean;
  filtros?: {
    q?: string | null;
    cidade?: string | null;
    estado?: string | null;
    limit?: number;
  };
}

/**
 * Hook para listar empresas disponíveis
 * Endpoint: GET /api/empresas/public/emp/lista
 * 
 * @param options - Opções de busca e filtros
 * 
 * @example
 * ```tsx
 * const { data: empresas } = useListarEmpresas({
 *   filtros: { q: "pizza", cidade: "São Paulo" }
 * });
 * ```
 */
export function useListarEmpresas(options?: UseListarEmpresasOptions) {
  const { filtros } = options ?? {};

  return useQuery<EmpresaDisponivel[]>({
    queryKey: [
      "empresas-disponiveis",
      filtros?.q ?? null,
      filtros?.cidade ?? null,
      filtros?.estado ?? null,
      filtros?.limit ?? null,
    ],
    queryFn: async () => {
      const { data } = await api.get<EmpresaDisponivel[]>("/api/empresas/public/emp/lista", {
        params: {
          q: filtros?.q ?? undefined,
          cidade: filtros?.cidade ?? undefined,
          estado: filtros?.estado ?? undefined,
          limit: filtros?.limit ?? undefined,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}

// Alias para manter compatibilidade
export const useQueryEmpresasDisponiveis = useListarEmpresas;

