// @cardapio/services/categoria/buscar-categoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { CategoriaMini } from "./types";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

/**
 * Hook para buscar categoria por ID
 * Endpoint: GET /api/cardapio/admin/categorias/{catId}
 * 
 * @param catId - ID da categoria
 * @param opts - Opções (enabled)
 * 
 * @example
 * ```tsx
 * const { data: categoria } = useBuscarCategoria(categoriaId);
 * ```
 */
export function useBuscarCategoria(catId: number | null, opts?: { enabled?: boolean }) {
  const qc = useQueryClient();
  const seed = catId ? qc.getQueryData<CategoriaMini>(["categoria", catId]) : undefined;
  const codEmpresa = getEmpresaId();

  return useQuery<CategoriaMini>({
    queryKey: ["categoria", codEmpresa, catId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<CategoriaMini>(`/api/cardapio/admin/categorias/${catId}`, {
        params: { cod_empresa: codEmpresa },
      });
      return data;
    },
    initialData: seed,
    enabled: codEmpresa > 0 && !!catId && (opts?.enabled ?? true),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

