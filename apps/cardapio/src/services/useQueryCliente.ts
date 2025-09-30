import { api } from "@cardapio/app/api/api";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { setCliente } from "@cardapio/stores/client/ClientStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { toast } from "sonner";

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
        telefone: data.telefone || undefined,
        tokenCliente: data.super_token,
      });
      invalidate();
      toast.success("Cliente criado com sucesso!"); // 👈 feedback positivo
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error)); // 👈 toast de erro
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
        telefone: data.telefone || undefined,
        tokenCliente: data.super_token,
      });
      invalidate();
      toast.success("Cliente atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  /** Enviar código OTP para telefone existente */
  const enviarCodigoNovoDispositivo = useMutation({
    mutationFn: (body: NovoDispositivoRequest) =>
      api.post("/delivery/cliente/novo-dispositivo", body),
    onSuccess: () => {
      toast.success("Código enviado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  /** Confirmar código OTP e receber token */
  const confirmarCodigo = useMutation({
    mutationFn: (body: ConfirmacaoCodigoRequest) =>
      api.post<ClienteOut>("/delivery/cliente/confirmar-codigo", body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        nome: data.nome,
        telefone: data.telefone || undefined,
        tokenCliente: data.super_token,
      });
      invalidate();
      toast.success("Código confirmado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return { create, update, enviarCodigoNovoDispositivo, confirmarCodigo };
}
