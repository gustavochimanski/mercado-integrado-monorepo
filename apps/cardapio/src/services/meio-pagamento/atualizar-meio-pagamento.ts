// @cardapio/services/meio-pagamento/atualizar-meio-pagamento.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { MeioPagamento } from "./types";

/**
 * Hook para atualizar um meio de pagamento
 * Endpoint: PUT /api/delivery/admin/meios-pagamento/{id}
 * 
 * @example
 * ```tsx
 * const atualizarMeioPagamento = useAtualizarMeioPagamento();
 * atualizarMeioPagamento.mutate({ id: 1, nome: "Novo nome", ... });
 * ```
 */
export function useAtualizarMeioPagamento() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  return useMutation({
    mutationFn: ({ id, ...body }: Partial<MeioPagamento> & { id: number }) =>
      apiAdmin.put(`/api/delivery/admin/meios-pagamento/${id}`, body),
    onSuccess: () => {
      toast.success("Meio de pagamento atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

