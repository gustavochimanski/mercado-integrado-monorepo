import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

// ------------------- Tipos -------------------
export interface CupomLinkOut {
  id: number;
  titulo: string;
  url: string;
}

export interface CupomParceiroOut {
  id: number;
  codigo: string;
  descricao?: string;
  desconto_valor?: number;
  desconto_percentual?: number;
  ativo: boolean;
  monetizado: boolean;
  valor_por_lead?: number;
  links: CupomLinkOut[];
}

// Banner vindo do parceiro full
export interface BannerParceiroOut {
  id: number;
  nome: string;
  ativo: boolean;
  tipo_banner: string;
  imagem?: string;
  categoria_id: number;
  href_destino: string;
  // 👇 adicionar os extras que o frontend espera
  parceiro_id: number;
  parceiro_nome?: string;
  categoria_destino?: string;
  created_at?: string;
  updated_at?: string;
}


export interface ParceiroCompletoOut {
  id: number;
  nome: string;
  ativo: boolean;
  telefone?: string;
  cupons: CupomParceiroOut[];
  banners: BannerParceiroOut[];
  created_at?: string;
  updated_at?: string;
}



// ------------------- Debounce -------------------
export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ------------------- Parceiros -------------------
export interface Parceiro {
  id: number;
  nome: string;
  ativo: boolean;
  telefone?: string 
  created_at: string;
  updated_at: string;
}

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

// ------------------- Parceiro Full -------------------
export function useParceiroFull(parceiroId?: number) {
  return useQuery<ParceiroCompletoOut>({
    queryKey: ["parceiro-full", parceiroId],
    queryFn: async () => {
      if (!parceiroId) throw new Error("ID do parceiro não fornecido");
      const { data } = await apiMensura.get<ParceiroCompletoOut>(`/api/delivery/parceiros/${parceiroId}/full`);
      return data;
    },
    enabled: !!parceiroId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ------------------- Mutations -------------------
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
      toast({ title: "Erro ao criar parceiro", description: getErrorMessage(err), variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Parceiro> & { id: number }) =>
      apiMensura.put(`/api/delivery/parceiros/${id}`, body),
    onSuccess: () => {
      toast({ title: "Parceiro atualizado!", description: "O parceiro foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao atualizar parceiro", description: getErrorMessage(err), variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/parceiros/${id}`),
    onSuccess: () => {
      toast({ title: "Parceiro removido!", description: "O parceiro foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao remover parceiro", description: getErrorMessage(err), variant: "destructive" }),
  });

  return { create, update, remove };
}
