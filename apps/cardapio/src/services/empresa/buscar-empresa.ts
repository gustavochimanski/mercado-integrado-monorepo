// @cardapio/services/empresa/buscar-empresa.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@cardapio/app/api/api";
import type { EmpresaPublic } from "./types";
import { setEmpresaData } from "@cardapio/stores/empresa/empresaStore";

interface UseBuscarEmpresaOptions {
  enabled?: boolean;
  empresaId?: number | null;
}

/**
 * Hook para buscar dados públicos de uma empresa específica
 * Endpoint: GET /api/empresas/public/emp/lista?empresa_id={empresaId}
 * 
 * Quando empresa_id é fornecido, a API retorna um objeto único.
 * Quando não é fornecido, retorna uma lista.
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
      const { data } = await api.get<EmpresaPublic | EmpresaPublic[]>("/api/empresas/public/emp/lista", {
        params: { empresa_id: empresaId },
      });
      
      // Quando empresa_id é fornecido, a API retorna um objeto único
      // Quando não é fornecido, retorna uma lista (mas não deveria acontecer aqui)
      const empresa = Array.isArray(data) ? data[0] : data;
      
      if (!empresa) {
        throw new Error("Empresa não encontrada");
      }
      
      // Salvar empresa completa no localStorage
      setEmpresaData(empresa);
      return empresa;
    },
    enabled: enabled && !!empresaId,
    staleTime: 0, // Sempre considerar stale para garantir busca quando empresa muda
    gcTime: 5 * 60 * 1000, // 5 minutos - manter cache por pouco tempo
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3, // Tentar 3 vezes em caso de erro
  });
}

// Alias para manter compatibilidade
export const useQueryEmpresaPublic = (enabled = true, empresaId: number | undefined) => 
  useBuscarEmpresa({ enabled, empresaId: empresaId ?? null });

