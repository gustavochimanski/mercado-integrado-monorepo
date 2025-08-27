import { api } from "@cardapio/app/api/api";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { setCliente } from "@cardapio/stores/client/ClientStore";
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
  super_token: string;
}

export interface ClienteCreate {
  nome: string;
  email?: string;
  telefone?: string | null;
  cpf_cnpj?: string | null;
}

export interface ClienteUpdate extends Partial<ClienteCreate> {}

/** 🔎 Criar / Atualizar cliente */
export function useMutateCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  const create = useMutation({
    mutationFn: (body: ClienteCreate) =>
      api.post<ClienteOut>("/delivery/cliente/", body),
    onSuccess: (response) => {
      toast.success("Cliente criado com sucesso!");

      const data = response.data;

      // 🔑 salva o token e normaliza campos para o store
      setCliente({
        nome: data.nome,
        tokenCliente: data.super_token,
      });
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & ClienteUpdate) =>
      apiClienteAdmin.put<ClienteOut>(`/delivery/cliente/${id}`, body),
    onSuccess: (response) => {
      toast.success("Cliente atualizado com sucesso!");

      const data = response.data;

      setCliente({
        nome: data.nome,
        tokenCliente: data.super_token,
      });

      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update };
}
