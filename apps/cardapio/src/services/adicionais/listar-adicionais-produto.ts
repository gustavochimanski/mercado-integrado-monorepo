// @cardapio/services/adicionais/listar-adicionais-produto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { AdicionalResponse } from "./types";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para listar todos os adicionais vinculados a um produto
 * Endpoint: GET /api/cadastros/admin/adicionais/produto/{cod_barras}?apenas_ativos={apenas_ativos}
 * 
 * @param cod_barras - Código de barras do produto
 * @param apenas_ativos - Se deve retornar apenas adicionais ativos (padrão: true)
 * @param opts - Opções adicionais (enabled)
 * 
 * @example
 * ```tsx
 * const { data: adicionais } = useListarAdicionaisProduto("123456", true);
 * ```
 */
export function useListarAdicionaisProduto(
  cod_barras: string,
  apenas_ativos: boolean = true,
  opts?: { enabled?: boolean }
) {
  const key = ["adicionais_produto", cod_barras, apenas_ativos] as const;

  return useQuery<AdicionalResponse[]>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiAdmin.get<AdicionalResponse[]>(
        `${BASE}/produto/${encodeURIComponent(cod_barras)}?apenas_ativos=${apenas_ativos}`
      );
      return data;
    },
    enabled: (opts?.enabled ?? true) && !!cod_barras,
    staleTime: 5 * 60 * 1000,
  });
}

