import { useQuery } from "@tanstack/react-query";
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { getToken } from "@cardapio/stores/token/tokenStore";
import { useModoSupervisor } from "@cardapio/lib/params/useModoSupervisor";
import type { ComboDTO, ListaCombosResponse } from "@cardapio/api";

/**
 * Hook para listar combos admin com paginação e busca
 * Endpoint: GET /api/catalogo/admin/combos/
 * 
 * @param empresaId - ID da empresa
 * @param page - Página atual (padrão: 1)
 * @param busca - Texto de busca (opcional) - busca em título e descrição
 * @param enabled - Se deve buscar ou não (padrão: true)
 * @param apenas_ativos - Se true, retorna apenas combos ativos (padrão: false)
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useListarCombosAdmin(empresaId, 1, busca, true, true);
 * ```
 */
export function useListarCombosAdmin(
  empresaId: number,
  page: number = 1,
  busca?: string,
  enabled: boolean = true,
  apenas_ativos: boolean = false
) {
  const isSupervisor = useModoSupervisor();
  const hasToken = !!getToken();
  
  // ✅ No modo supervisor, só fazer requisição se tiver token
  const shouldEnable = enabled && !!empresaId && (!isSupervisor || hasToken);
  
  return useQuery<{ combos: ComboDTO[]; hasMore: boolean }>({
    queryKey: ["combos_admin", empresaId, page, busca, apenas_ativos],
    queryFn: async () => {
      const params: Record<string, any> = { 
        cod_empresa: empresaId,
        page,
        limit: 30,
      };
      
      // Adicionar parâmetro search se houver busca
      if (busca?.trim()) {
        params.search = busca.trim();
      }
      
      // Adicionar parâmetro apenas_ativos se solicitado
      if (apenas_ativos) {
        params.apenas_ativos = true;
      }
      
      const { data } = await apiAdmin.get<ListaCombosResponse>("/api/catalogo/admin/combos/", { params });
      
      return { combos: data.data || [], hasMore: data.has_more };
    },
    enabled: shouldEnable,
    staleTime: 5 * 60 * 1000,
  });
}

