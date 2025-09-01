
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** 🎯 Tipos */
export interface EnderecoOut {
  id: number;
  token_cliente: string;
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
  token_cliente: string;
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
export function useQueryEnderecos(token_cliente?: string, opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["enderecos", token_cliente],
    queryFn: async () => {
      if (!token_cliente) return [];
      const { data } = await apiClienteAdmin.get<EnderecoOut[]>(`/delivery/enderecos?cliente=${token_cliente}`);
      return data;
    },
    enabled: opts?.enabled ?? !!token_cliente,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useGetEnderecoById(token_cliente?: string, opts?: { enabled?: boolean }) {
  
}


/** 🛠️ Criar / Atualizar / Deletar endereços */
export function useMutateEndereco(token_cliente: string) {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["enderecos", token_cliente] });
  };

  const create = useMutation({
    mutationFn: (body: EnderecoCreate) =>
      apiClienteAdmin.post<EnderecoOut>("/delivery/enderecos", body),
    onSuccess: () => {
      toast.success("Endereço criado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & EnderecoUpdate) =>
      apiClienteAdmin.put<EnderecoOut>(`/delivery/enderecos/${id}`, body),
    onSuccess: () => {
      toast.success("Endereço atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      apiClienteAdmin.delete<void>(`/delivery/enderecos/${id}`),
    onSuccess: () => {
      toast.success("Endereço removido!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, remove };
}
