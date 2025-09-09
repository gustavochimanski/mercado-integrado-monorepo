import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

// 🔎 Tipo do banner
export interface Banner {
  id: number;
  nome: string;
  parceiro_id: number;
  parceiro_nome: string;
  tipo_banner: "V" | "H";
  categoria_destino: number
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
  const { toast } = useToast();

  const invalidate = () => {
  qc.invalidateQueries({ queryKey: ["parceiro-full"], exact: false });
  qc.invalidateQueries({ queryKey: ["banners"], exact: false });
};


  const create = useMutation({
    mutationFn: (body: FormData) =>
      apiMensura.post("/api/delivery/banners", body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast({ title: "Banner criado!", description: "O banner foi criado com sucesso." });
      invalidate();
    },
    onError: (err) => {
      toast({ title: "Erro ao criar banner", description: getErrorMessage(err), variant: "destructive"  });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: FormData }) =>
      apiMensura.put(`/api/delivery/banners/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      toast({ title: "Banner atualizado!", description: "O banner foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) => {
      toast({ title: "Erro ao atualizar banner", description: getErrorMessage(err), variant: "destructive"  });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/banners/${id}`),
    onSuccess: () => {
      toast({ title: "Banner removido!", description: "O banner foi removido com sucesso." });
      invalidate();
    },
    onError: (err) => {
      toast({ title: "Erro ao remover banner", description: getErrorMessage(err), variant: "destructive"  });
    },
  });

  return { create, update, remove };
}
