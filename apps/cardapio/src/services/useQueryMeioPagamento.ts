import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import type { MeioPagamentoResponse } from "@cardapio/api/models/MeioPagamentoResponse";
import type { MeioPagamentoCreate } from "@cardapio/api/models/MeioPagamentoCreate";

// 🔎 Usar tipo gerado da API
export type MeioPagamento = MeioPagamentoResponse;

// ⏳ Debounce simples
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ✅ Buscar todos os meios de pagamento (apenas ativos)
export function useMeiosPagamento(enabled = true) {
  const qc = useQueryClient();
  return useQuery<MeioPagamento[]>({
    queryKey: ["meios_pagamento"],
    queryFn: async () => {
      const { data } = await apiClienteAdmin.get<MeioPagamento[]>("/api/delivery/client/meios-pagamento/");
      // Filtrar apenas meios de pagamento ativos
      return data.filter(m => m.ativo !== false);
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Mutations para criar, atualizar, deletar
export function useMutateMeioPagamento() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  const create = useMutation({
    mutationFn: (body: MeioPagamentoCreate) =>
      apiAdmin.post("/api/delivery/meios-pagamento", body),
    onSuccess: () => {
      toast.success("Meio de pagamento criado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<MeioPagamento> & { id: number }) =>
      apiAdmin.put(`/api/delivery/meios-pagamento/${id}`, body),
    onSuccess: () => {
      toast.success("Meio de pagamento atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`/api/delivery/meios-pagamento/${id}`),
    onSuccess: () => {
      toast.success("Meio de pagamento removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
