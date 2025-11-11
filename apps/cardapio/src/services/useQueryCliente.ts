import { api } from "@cardapio/app/api/api";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import apiAdmin from "@cardapio/app/api/apiAdmin";
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

export type ClienteUpdate = Partial<ClienteCreate>;

export interface NovoDispositivoRequest {
  telefone: string;
}

export interface ConfirmacaoCodigoRequest {
  telefone: string;
  codigo: string;
}

export interface NovoDispositivoResponse {
  super_token: string;
  nome: string;
  telefone: string;
}

async function sincronizarClienteAtual() {
  try {
    const { data } = await apiClienteAdmin.get<ClienteOut>("/api/cadastros/client/clientes/me");
    if (data) {
      setCliente({
        id: data.id,
        nome: data.nome,
        telefone: data.telefone || undefined,
        tokenCliente: data.super_token,
      });
    }
  } catch (error) {
    console.warn("Não foi possível sincronizar dados completos do cliente:", error);
  }
}

export function useMutateCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  /** Criar cliente novo */
  const create = useMutation({
    mutationFn: (body: ClienteCreate) =>
      apiAdmin.post<ClienteOut>("/api/cadastros/client/clientes/", body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        id: data.id,
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
      apiClienteAdmin.put<ClienteOut>(`/api/cadastros/client/clientes/me`, body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        id: data.id,
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
      api.post("/api/cadastros/client/clientes/novo-dispositivo", body),
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
      api.post<ClienteOut>("/api/cadastros/client/clientes/confirmar-codigo", body),
    onSuccess: (response) => {
      const data = response.data;
      setCliente({
        id: data.id,
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

  /** Login direto apenas com telefone (sem código) */
  const loginDireto = useMutation({
    mutationFn: (body: NovoDispositivoRequest) =>
      apiAdmin.post<NovoDispositivoResponse>("/api/cadastros/client/clientes/novo-dispositivo", body),
    onSuccess: async (response) => {
      const data = response.data;
      setCliente({
        nome: data.nome,
        telefone: data.telefone || undefined,
        tokenCliente: data.super_token,
      });
      await sincronizarClienteAtual();
      invalidate();
      toast.success("Login realizado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return { create, update, enviarCodigoNovoDispositivo, confirmarCodigo, loginDireto };
}
