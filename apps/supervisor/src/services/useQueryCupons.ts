import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

// -----------------------------
// 🔎 Tipos
// -----------------------------
export interface Cupom {
  id: number;
  codigo: string;
  descricao?: string;
  desconto_valor?: number;
  desconto_percentual?: number;
  ativo: boolean;
  validade_inicio?: string;
  validade_fim?: string;
  minimo_compra?: number;
  created_at: string;
  updated_at: string;
  monetizado: boolean;
  valor_por_lead?: number;
  parceiro_id?: number;
  link_whatsapp?: string;
  links?: CupomLink[];
}

export interface CupomLink {
  id: number;
  cupom_id: number;
  titulo: string;
  url: string;
}

export interface Parceiro {
  id: number;
  nome: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

// -----------------------------
// ⏳ Debounce simples
// -----------------------------
export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// -----------------------------
// ✅ Hooks de consulta
// -----------------------------
export function useCupons(enabled = true) {
  return useQuery<Cupom[]>({
    queryKey: ["cupons"],
    queryFn: async () => {
      const { data } = await apiMensura.get<Cupom[]>("/api/delivery/cupons");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
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

// -----------------------------
// ✅ Hooks de mutation (cupons)
// -----------------------------
export function useMutateCupom() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cupons"] });

  const create = useMutation({
    mutationFn: (body: Omit<Cupom, "id" | "created_at" | "updated_at">) =>
      apiMensura.post("/api/delivery/cupons", {
        ...body,
        // Só envia parceiro se monetizado
        parceiro_id: body.monetizado ? body.parceiro_id : undefined,
      }),
    onSuccess: () => {
      toast({ title: "Cupom criado!", description: "O cupom foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao criar cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<Cupom> & { id: number }) =>
      apiMensura.put(`/api/delivery/cupons/${id}`, {
        ...body,
        // Só envia parceiro se monetizado
        parceiro_id: body.monetizado ? body.parceiro_id : undefined,
      }),
    onSuccess: () => {
      toast({ title: "Cupom atualizado!", description: "O cupom foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao atualizar cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/cupons/${id}`),
    onSuccess: () => {
      toast({ title: "Cupom removido!", description: "O cupom foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao remover cupom",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  return { create, update, remove };
}

// -----------------------------
// ✅ Hooks de mutation (links de cupom)
// -----------------------------
export function useMutateCupomLink(cupom_id: number) {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cupons"] });

  const create = useMutation({
    mutationFn: (body: Omit<CupomLink, "id" | "cupom_id">) =>
      apiMensura.post(`/api/delivery/cupons/links/${cupom_id}`, body),
    onSuccess: () => {
      toast({ title: "Link criado!", description: "O link do cupom foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao criar link",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: Partial<CupomLink> & { id: number }) =>
      apiMensura.put(`/api/delivery/cupons/links/${id}`, body),
    onSuccess: () => {
      toast({ title: "Link atualizado!", description: "O link do cupom foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao atualizar link",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/cupons/links/${id}`),
    onSuccess: () => {
      toast({ title: "Link removido!", description: "O link do cupom foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao remover link",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  return { create, update, remove };
}
