import { api } from "@cardapio/app/api/api";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** 🎯 Tipos vindos do backend */
export interface ClienteOut {
  id: number;
  nome: string;
  email?: string;
  telefone?: string | null;
  cpf_cnpj?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClienteCreate {
  nome: string;
  email?: string;
  telefone?: string | null;
  cpf_cnpj?: string | null;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {}

/** 🔎 Buscar cliente logado (current) */
export function useQueryCliente(opts?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["cliente", "current"],
    queryFn: async () => {
      const { data } = await api.get<ClienteOut>("api/delivery/cliente");
      return data;
    },
    enabled: opts?.enabled ?? true, // permite desabilitar manualmente
    staleTime: 5 * 60 * 1000,       // 5min cache
    gcTime: 30 * 60 * 1000,         // 30min no garbage collector
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

/** 🛠️ Criar / Atualizar cliente */
export function useMutateCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  const create = useMutation({
    mutationFn: (body: ClienteCreate) =>
      api.post<ClienteOut>("api/delivery/cliente/", body),
    onSuccess: () => {
      toast.success("Cliente criado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & ClienteUpdate) =>
      api.put<ClienteOut>(`api/delivery/cliente/${id}`, body),
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update };
}
