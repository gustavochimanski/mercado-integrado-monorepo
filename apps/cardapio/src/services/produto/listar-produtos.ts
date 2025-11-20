// @cardapio/services/produto/listar-produtos.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { ProdutosPaginadosResponse } from "./types";

const BASE = "/api/catalogo/admin/produtos";

/**
 * Hook para listar produtos com paginação
 * Endpoint: GET /api/cadastros/admin/produtos
 * 
 * @param cod_empresa - ID da empresa
 * @param page - Página atual
 * @param limit - Limite de itens por página (padrão: 30)
 * @param apenas_disponiveis - Se deve retornar apenas produtos disponíveis (padrão: false)
 * 
 * @example
 * ```tsx
 * const { data } = useListarProdutos(empresaId, 1, 30, false);
 * ```
 */
export function useListarProdutos(
  cod_empresa: number,
  page: number,
  limit = 30,
  apenas_disponiveis = false
) {
  const key = ["produtos", cod_empresa, page, limit, apenas_disponiveis] as const;

  return useQuery<ProdutosPaginadosResponse>({
    queryKey: key,
    queryFn: async () => {
      const res = await apiAdmin.get(
        `${BASE}?cod_empresa=${cod_empresa}&page=${page}&limit=${limit}&apenas_disponiveis=${apenas_disponiveis}`
      );
      return res.data as ProdutosPaginadosResponse;
    },
  });
}

