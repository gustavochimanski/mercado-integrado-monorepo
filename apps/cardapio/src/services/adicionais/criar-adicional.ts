// @cardapio/services/adicionais/criar-adicional.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { CriarAdicionalRequest, AdicionalResponse } from "./types";
import { normalizeCriarAdicionalRequest } from "./utils";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para criar um novo adicional
 * Endpoint: POST /api/cadastros/admin/adicionais
 * 
 * @example
 * ```tsx
 * const criarAdicional = useCriarAdicional();
 * criarAdicional.mutate({ empresa_id: 1, nome: "Bacon", preco: 5.00 });
 * ```
 */
export function useCriarAdicional() {
  const qc = useQueryClient();

  const invalidate = (empresaId?: number) => {
    qc.invalidateQueries({ queryKey: ["adicionais"], exact: false });
    if (empresaId) {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && k[0] === "adicionais" && k[1] === empresaId;
        },
      });
    }
    qc.invalidateQueries({ queryKey: ["adicionais_produto"], exact: false });
  };

  return useMutation({
    mutationFn: async (input: CriarAdicionalRequest) => {
      const normalized = normalizeCriarAdicionalRequest(input);
      const { data } = await apiAdmin.post<AdicionalResponse>(BASE, normalized);
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional criado com sucesso!");
      invalidate(vars.empresa_id);
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao criar adicional")),
  });
}

