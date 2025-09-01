import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";

// 🔎 Tipo do banner
export interface Banner {
  id: number;
  nome: string;
  parceiro_id: number;
  parceiro_nome: string;
  tipo_banner: "V" | "H";
  ativo: boolean
  imagem: string;
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

// ✅ Buscar todos os banners
export function useBanners(enabled = true) {
  const qc = useQueryClient();
  return useQuery<Banner[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      const { data } = await apiMensura.get<Banner[]>("/api/delivery/banners");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Mutations para criar, atualizar, deletar banner
export function useMutateBanner() {
  const qc = useQueryClient();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["banners"] });

  const create = useMutation({
    mutationFn: (body: Omit<Banner, "id" | "created_at" | "updated_at" | "parceiro_nome">) =>
      apiMensura.post("/api/delivery/banners", body),
    onSuccess: () => {
      toast.success("Banner criado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Banner> & { id: number }) =>
      apiMensura.put(`/api/delivery/banners/${id}`, body),
    onSuccess: () => {
      toast.success("Banner atualizado!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/banners/${id}`),
    onSuccess: () => {
      toast.success("Banner removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
