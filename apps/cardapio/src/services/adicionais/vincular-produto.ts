// @cardapio/services/adicionais/vincular-produto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { VincularAdicionaisProdutoRequest } from "./types";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para vincular adicionais a um produto
 * IMPORTANTE: Este endpoint substitui todos os adicionais vinculados ao produto
 * Endpoint: POST /api/cadastros/admin/adicionais/produto/{cod_barras}/vincular
 * 
 * @example
 * ```tsx
 * const vincularProduto = useVincularAdicionaisProduto();
 * vincularProduto.mutate({ cod_barras: "123", adicional_ids: [1, 2, 3] });
 * ```
 */
export function useVincularAdicionaisProduto() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cod_barras,
      adicional_ids,
    }: {
      cod_barras: string;
      adicional_ids: number[];
    }) => {
      const payload: VincularAdicionaisProdutoRequest = {
        adicional_ids,
      };
      const { data } = await apiAdmin.post(
        `${BASE}/produto/${encodeURIComponent(cod_barras)}/vincular`,
        payload
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicionais vinculados com sucesso!");
      qc.invalidateQueries({ 
        queryKey: ["adicionais_produto", vars.cod_barras],
        exact: false 
      });
      qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao vincular adicionais ao produto")),
  });
}

