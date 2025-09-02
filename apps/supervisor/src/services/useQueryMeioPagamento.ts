import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";
import { useToast } from "@supervisor/hooks/use-toast";

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
  const { toast } = useToast();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  const create = useMutation({
    mutationFn: (body: Omit<MeioPagamento, "id" | "created_at" | "updated_at">) =>
      apiMensura.post("/api/delivery/meios-pagamento/", body),
    onSuccess: () => {
      toast({ title: "Meio de pagamento criado!", description: "O meio de pagamento foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao criar meio de pagamento", description: extractErrorMessage(err), variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<MeioPagamento> & { id: number }) =>
      apiMensura.put(`/api/delivery/meios-pagamento/${id}`, body),
    onSuccess: () => {
      toast({ title: "Meio de pagamento atualizado!", description: "O meio de pagamento foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao atualizar meio de pagamento", description: extractErrorMessage(err), variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/meios-pagamento/${id}`),
    onSuccess: () => {
      toast({ title: "Meio de pagamento removido!", description: "O meio de pagamento foi removido com sucesso."});
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao remover meio de pagamento", description: extractErrorMessage(err) , variant: "destructive" }),
  });

  return { create, update, remove };
}
