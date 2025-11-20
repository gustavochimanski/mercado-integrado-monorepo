// @cardapio/services/cliente/confirmar-codigo.ts
import { api } from "@cardapio/app/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { setCliente } from "@cardapio/stores/client/ClientStore";
import type { ConfirmacaoCodigoRequest, ClienteOut } from "./types";

/**
 * Hook para confirmar código OTP e receber token
 * Endpoint: POST /api/cadastros/client/clientes/confirmar-codigo
 * 
 * @example
 * ```tsx
 * const confirmarCodigo = useConfirmarCodigo();
 * confirmarCodigo.mutate({ telefone: "11999999999", codigo: "123456" });
 * ```
 */
export function useConfirmarCodigo() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  return useMutation({
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
}

