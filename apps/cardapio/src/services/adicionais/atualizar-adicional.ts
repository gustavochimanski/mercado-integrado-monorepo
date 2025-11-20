// @cardapio/services/adicionais/atualizar-adicional.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { AtualizarAdicionalRequest, AdicionalResponse } from "./types";
import { normalizeAtualizarAdicionalRequest } from "./utils";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para atualizar um adicional existente
 * Endpoint: PUT /api/cadastros/admin/adicionais/{adicional_id}
 * 
 * @example
 * ```tsx
 * const atualizarAdicional = useAtualizarAdicional();
 * atualizarAdicional.mutate({ adicional_id: 1, input: { nome: "Bacon Extra" } });
 * ```
 */
export function useAtualizarAdicional() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      adicional_id, 
      input 
    }: { 
      adicional_id: number; 
      input: AtualizarAdicionalRequest 
    }) => {
      const normalized = normalizeAtualizarAdicionalRequest(input);
      const { data } = await apiAdmin.put<AdicionalResponse>(
        `${BASE}/${adicional_id}`,
        normalized
      );
      return data;
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional atualizado com sucesso!");
      qc.invalidateQueries({ queryKey: ["adicional", vars.adicional_id] });
      qc.invalidateQueries({ queryKey: ["adicionais"], exact: false });
      qc.invalidateQueries({ queryKey: ["adicionais_produto"], exact: false });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao atualizar adicional")),
  });
}

