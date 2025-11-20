// @cardapio/services/meio-pagamento/remover-meio-pagamento.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

/**
 * Hook para remover um meio de pagamento
 * Endpoint: DELETE /api/delivery/admin/meios-pagamento/{id}
 * 
 * @example
 * ```tsx
 * const removerMeioPagamento = useRemoverMeioPagamento();
 * removerMeioPagamento.mutate(1);
 * ```
 */
export function useRemoverMeioPagamento() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  return useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`/api/delivery/admin/meios-pagamento/${id}`),
    onSuccess: () => {
      toast.success("Meio de pagamento removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

