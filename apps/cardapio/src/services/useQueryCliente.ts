import { api } from "@cardapio/app/api/api";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { setCliente } from "@cardapio/stores/client/ClientStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** Tipos vindos do backend */
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

export interface NovoDispositivoRequest {
  telefone: string;
}

export interface ConfirmacaoCodigoRequest {
  telefone: string;
  codigo: string;
}

export function useMutateCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  /** Criar cliente novo */
  const create = useMutation({
    mutationFn: (body: ClienteCreate) =>
      api.post<ClienteOut>("/delivery/cliente/", body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        nome: data.nome,
        tokenCliente: data.super_token,
      });
      invalidate();
    },
  });

  /** Atualizar cliente */
  const update = useMutation({
    mutationFn: ({ id, ...body }: { id: number } & ClienteUpdate) =>
      apiClienteAdmin.put<ClienteOut>(`/delivery/cliente/${id}`, body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        nome: data.nome,
        tokenCliente: data.super_token,
      });
      invalidate();
    },
  });

  /** Enviar código OTP para telefone existente */
  const enviarCodigoNovoDispositivo = useMutation({
    mutationFn: (body: NovoDispositivoRequest) =>
      api.post("/delivery/cliente/novo-dispositivo", body),
  });

  /** Confirmar código OTP e receber token */
  const confirmarCodigo = useMutation({
    mutationFn: (body: ConfirmacaoCodigoRequest) =>
      api.post<ClienteOut>("/delivery/cliente/confirmar-codigo", body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        nome: data.nome,
        tokenCliente: data.super_token,
      });
      invalidate();
    },
  });

  return { create, update, enviarCodigoNovoDispositivo, confirmarCodigo };
}
