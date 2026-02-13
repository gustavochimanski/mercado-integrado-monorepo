// @cardapio/services/cliente/login-direto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { setCliente, getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { NovoDispositivoRequest, NovoDispositivoResponse, ClienteOut } from "./types";

async function sincronizarClienteAtual() {
  try {
    const token = getTokenCliente() || "";
    const { data } = await apiClienteAdmin.get<ClienteOut>("/api/cadastros/client/clientes/me", {
      headers: token ? { "x-super-token": token } : undefined,
    });
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

/**
 * Hook para login direto apenas com telefone (sem código)
 * Endpoint: POST /api/cadastros/client/clientes/novo-dispositivo
 * 
 * @example
 * ```tsx
 * const loginDireto = useLoginDireto();
 * loginDireto.mutate({ telefone: "11999999999" });
 * ```
 */
export function useLoginDireto() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  return useMutation({
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
}

