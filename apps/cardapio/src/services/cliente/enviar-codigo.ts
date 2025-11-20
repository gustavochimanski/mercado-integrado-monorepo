// @cardapio/services/cliente/enviar-codigo.ts
import { api } from "@cardapio/app/api/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { NovoDispositivoRequest } from "./types";

/**
 * Hook para enviar código OTP para telefone existente
 * Endpoint: POST /api/cadastros/client/clientes/novo-dispositivo
 * 
 * @example
 * ```tsx
 * const enviarCodigo = useEnviarCodigo();
 * enviarCodigo.mutate({ telefone: "11999999999" });
 * ```
 */
export function useEnviarCodigo() {
  return useMutation({
    mutationFn: (body: NovoDispositivoRequest) =>
      api.post("/api/cadastros/client/clientes/novo-dispositivo", body),
    onSuccess: () => {
      toast.success("Código enviado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

