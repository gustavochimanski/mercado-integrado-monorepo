import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

// 🔎 Tipo do parceiro
export interface Parceiro {
  id: number;
  nome: string;
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

// ✅ Buscar todos os parceiros
export function useParceiros(enabled = true) {
  return useQuery<Parceiro[]>({
    queryKey: ["parceiros"],
    queryFn: async () => {
      const { data } = await apiMensura.get<Parceiro[]>("/api/delivery/parceiros");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Mutations para criar, atualizar, deletar parceiro
export function useMutateParceiro() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["parceiros"] });

  const create = useMutation({
    mutationFn: (body: Omit<Parceiro, "id" | "created_at" | "updated_at">) =>
      apiMensura.post("/api/delivery/parceiros", body),
    onSuccess: () => {
      toast({ title: "Parceiro criado!", description: "O parceiro foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao criar parceiro", description: getErrorMessage(err), variant: "destructive"  }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Parceiro> & { id: number }) =>
      apiMensura.put(`/api/delivery/parceiros/${id}`, body),
    onSuccess: () => {
      toast({ title: "Parceiro atualizado!", description: "O parceiro foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao atualizar parceiro", description: getErrorMessage(err), variant: "destructive"  }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/parceiros/${id}`),
    onSuccess: () => {
      toast({ title: "Parceiro removido!", description: "O parceiro foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao remover parceiro", description: getErrorMessage(err), variant: "destructive"  }),
  });

  return { create, update, remove };
}
