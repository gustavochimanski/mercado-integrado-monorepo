// @cardapio/services/meio-pagamento/criar-meio-pagamento.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { MeioPagamentoCreate } from "./types";

/**
 * Hook para criar um meio de pagamento
 * Endpoint: POST /api/delivery/admin/meios-pagamento/
 * 
 * @example
 * ```tsx
 * const criarMeioPagamento = useCriarMeioPagamento();
 * criarMeioPagamento.mutate({ nome: "Cartão de Crédito", ... });
 * ```
 */
export function useCriarMeioPagamento() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  return useMutation({
    mutationFn: (body: MeioPagamentoCreate) =>
      apiAdmin.post("/api/delivery/admin/meios-pagamento/", body),
    onSuccess: () => {
      toast.success("Meio de pagamento criado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

