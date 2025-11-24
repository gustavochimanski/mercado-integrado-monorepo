import { useQuery } from "@tanstack/react-query";
import apiAdmin from "@cardapio/app/api/apiAdmin";
import type { ComboDTO, ListaCombosResponse } from "@cardapio/api";

/**
 * Hook para listar combos admin com paginação e busca
 * Endpoint: GET /api/cadastros/admin/combos/
 * 
 * @param empresaId - ID da empresa
 * @param page - Página atual (padrão: 1)
 * @param busca - Texto de busca (opcional)
 * @param enabled - Se deve buscar ou não (padrão: true)
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useListarCombosAdmin(empresaId, 1, busca);
 * ```
 */
export function useListarCombosAdmin(
  empresaId: number,
  page: number = 1,
  busca?: string,
  enabled: boolean = true
) {
  return useQuery<{ combos: ComboDTO[]; hasMore: boolean }>({
    queryKey: ["combos_admin", empresaId, page, busca],
    queryFn: async () => {
      const params: Record<string, any> = { 
        cod_empresa: empresaId,
        page,
        limit: 30,
      };
      const { data } = await apiAdmin.get<ListaCombosResponse>("/api/cadastros/admin/combos/", { params });
      
      // Filtrar por busca se necessário (client-side por enquanto)
      let combos = data.data || [];
      if (busca?.trim()) {
        combos = combos.filter(c => 
          c.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          c.descricao?.toLowerCase().includes(busca.toLowerCase())
        );
      }
      
      return { combos, hasMore: data.has_more };
    },
    enabled: enabled && !!empresaId,
    staleTime: 5 * 60 * 1000,
  });
}

