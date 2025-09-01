import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";
import { toastErro, toastSucess } from "@supervisor/lib/toast";

// 🔎 Tipo do resultado do endpoint /api/delivery/meios-pagamento
export interface MeioPagamento {
  id: number;
  nome: string;
  tipo: "CARTAO_ENTREGA" | "PIX_ENTREGA" | "DINHEIRO" | "CARTAO_ONLINE" | "PIX_ONLINE";
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// ⏳ Debounce simples
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ✅ Buscar todos os meios de pagamento
export function useMeiosPagamento(enabled = true) {
  const qc = useQueryClient();
  return useQuery<MeioPagamento[]>({
    queryKey: ["meios_pagamento"],
    queryFn: async () => {
      const { data } = await apiMensura.get<MeioPagamento[]>("/api/delivery/meios-pagamento/admin");
      return data;
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
    mutationFn: (body: Omit<MeioPagamento, "id" | "created_at" | "updated_at">) =>
      apiMensura.post("/api/delivery/meios-pagamento/", body),
    onSuccess: () => {
      toastSucess("Meio de pagamento criado!");
      invalidate();
    },
    onError: (err) => toastErro(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<MeioPagamento> & { id: number }) =>
      apiMensura.put(`/api/delivery/meios-pagamento/${id}`, body),
    onSuccess: () => {
      toastSucess("Meio de pagamento atualizado!");
      invalidate();
    },
    onError: (err) => toastErro(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/meios-pagamento/${id}`),
    onSuccess: () => {
      toastSucess("Meio de pagamento removido!");
      invalidate();
    },
    onError: (err) => toastErro(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
