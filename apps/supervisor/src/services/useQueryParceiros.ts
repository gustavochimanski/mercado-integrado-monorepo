import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";

// 🔎 Tipo do parceiro
export interface Parceiro {
  id: number;
  nome: string;
  ativo: boolean
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
  const qc = useQueryClient();
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

  const invalidate = () => qc.invalidateQueries({ queryKey: ["parceiros"] });

  const create = useMutation({
    mutationFn: (body: Omit<Parceiro, "id" | "created_at" | "updated_at">) =>
      apiMensura.post("/api/delivery/parceiros", body),
    onSuccess: () => {
      toast.success("Parceiro criado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Parceiro> & { id: number }) =>
      apiMensura.put(`/api/delivery/parceiros/${id}`, body),
    onSuccess: () => {
      toast.success("Parceiro atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/parceiros/${id}`),
    onSuccess: () => {
      toast.success("Parceiro removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
