// @cardapio/services/produto/atualizar-produto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { UpdateProdutoInput } from "./types";
import { buildProdutoFormData } from "./utils";

const BASE = "/api/catalogo/admin/produtos";

/**
 * Hook para atualizar um produto
 * Endpoint: PUT /api/cadastros/admin/produtos/{cod_barras}
 * 
 * @example
 * ```tsx
 * const atualizarProduto = useAtualizarProduto();
 * atualizarProduto.mutate({ cod_barras: "123", descricao: "Nova descrição", ... });
 * ```
 */
export function useAtualizarProduto() {
  const qc = useQueryClient();

  const invalidate = (codEmpresa?: number) => {
    qc.invalidateQueries({ queryKey: ["produtos"], exact: false });
    if (codEmpresa) {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && k[0] === "produtos" && k[1] === codEmpresa;
        },
      });
    }
  };

  const reloadPage = (cod_empresa: number) => {
    invalidate(cod_empresa);
    window.location.reload();
  };

  return useMutation({
    mutationFn: async (input: UpdateProdutoInput) => {
      const { cod_barras } = input;
      const fd = buildProdutoFormData(input);
      const { data } = await apiAdmin.put(`${BASE}/${encodeURIComponent(cod_barras)}`, fd);
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Produto atualizado com sucesso!");
      reloadPage(vars.cod_empresa);
    },
    onError: (err: any) => toast.error(extractErrorMessage(err, "Erro ao atualizar produto")),
  });
}

