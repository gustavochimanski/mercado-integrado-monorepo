// @cardapio/services/produto/buscar-produtos.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ProdutosPaginadosResponse } from "./types";

const BASE = "/api/catalogo/admin/produtos";

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * Hook para buscar produtos com filtros
 * Endpoint: GET /api/catalogo/admin/produtos/
 * 
 * @param cod_empresa - ID da empresa
 * @param search - Termo de busca (código de barras, descrição ou SKU)
 * @param opts - Opções de paginação e filtros
 * 
 * @example
 * ```tsx
 * const { data } = useBuscarProdutos(empresaId, "pizza", { page: 1, limit: 30 });
 * ```
 */
export function useBuscarProdutos(
  cod_empresa: number,
  search: string,
  opts?: { page?: number; limit?: number; apenas_disponiveis?: boolean; enabled?: boolean }
) {
  const {
    page = 1,
    limit = 30,
    apenas_disponiveis = false,
    enabled,
  } = opts ?? {};
  const searchDeb = useDebounced(search, 350);

  return useQuery<ProdutosPaginadosResponse>({
    queryKey: ["produtos_search", cod_empresa, searchDeb, page, limit, apenas_disponiveis],
    queryFn: async () => {
      const params: Record<string, any> = {
        cod_empresa,
        page,
        limit,
        apenas_disponiveis,
      };
      if (searchDeb?.trim()) params.search = searchDeb.trim();

      const { data } = await apiAdmin.get(`${BASE}/`, { params });
      return data as ProdutosPaginadosResponse;
    },
    enabled: enabled ?? !!cod_empresa,
    staleTime: 5 * 60 * 1000,
  });
}

