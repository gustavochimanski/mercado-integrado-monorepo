import { api } from "@cardapio/app/api/api";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** 🎯 Tipos */
export interface EnderecoOut {
  id: number;
  cliente_telefone: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep: string;
  padrao?: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnderecoCreate {
  cliente_telefone: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface EnderecoUpdate extends Partial<EnderecoCreate> {}

/** 🔎 Buscar endereços do cliente */
export function useQueryEnderecos(clienteId?: string, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["enderecos", clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      const { data } = await api.get<EnderecoOut[]>(`api/delivery/enderecos?cliente_id=${clienteId}`);
      return data;
    },
    enabled: opts?.enabled ?? !!clienteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

/** 🛠️ Criar / Atualizar / Deletar endereços */
export function useMutateEndereco(clienteId: string) {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["enderecos", clienteId] });
  };

  const create = useMutation({
    mutationFn: (body: EnderecoCreate) =>
      api.post<EnderecoOut>("/delivery/enderecos", body),
    onSuccess: () => {
      toast.success("Endereço criado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & EnderecoUpdate) =>
      api.put<EnderecoOut>(`/delivery/enderecos/${id}`, body),
    onSuccess: () => {
      toast.success("Endereço atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api.delete<void>(`/delivery/enderecos/${id}`),
    onSuccess: () => {
      toast.success("Endereço removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
