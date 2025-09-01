import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { extractErrorMessage } from "@supervisor/lib/extractErrorMessage";
import { toastSucess, toastErro } from "@supervisor/lib/toast";

// 🔎 Tipo do banner
export interface Banner {
  id: number;
  nome: string;
  parceiro_id: number;
  parceiro_nome: string;
  tipo_banner: "V" | "H";
  ativo: boolean;
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
    // ⚠️ agora aceitamos FormData
    mutationFn: (body: FormData) =>
      apiMensura.post("/api/delivery/banners", body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toastSucess("Banner criado!");
      invalidate();
    },
    onError: (err) => {
      toastErro(extractErrorMessage(err));
    },
  });


  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: FormData }) =>
      apiMensura.put(`/api/delivery/banners/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toastSucess("Banner atualizado!");
      invalidate();
    },
    onError: (err) => {
      toastErro(extractErrorMessage(err));
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/banners/${id}`),
    onSuccess: () => {
      toastSucess("Banner removido!");
      invalidate();
    },
    onError: (err) => {
      toastErro(extractErrorMessage(err));
    },
  });

  return { create, update, remove };
}
