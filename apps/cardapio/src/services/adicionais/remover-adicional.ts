// @cardapio/services/adicionais/remover-adicional.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

const BASE = "/api/cadastros/admin/adicionais";

/**
 * Hook para deletar um adicional
 * Endpoint: DELETE /api/cadastros/admin/adicionais/{adicional_id}
 * 
 * @example
 * ```tsx
 * const removerAdicional = useRemoverAdicional();
 * removerAdicional.mutate({ adicional_id: 1, empresa_id: 1 });
 * ```
 */
export function useRemoverAdicional() {
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
    mutationFn: async ({ 
      adicional_id, 
      empresa_id 
    }: { 
      adicional_id: number; 
      empresa_id: number 
    }) => {
      await apiAdmin.delete(`${BASE}/${adicional_id}`);
    },
    onSuccess: (_data, vars) => {
      toast.success("Adicional deletado com sucesso!");
      invalidate(vars.empresa_id);
      qc.removeQueries({ queryKey: ["adicional", vars.adicional_id] });
    },
    onError: (err: any) => 
      toast.error(extractErrorMessage(err, "Erro ao deletar adicional")),
  });
}

