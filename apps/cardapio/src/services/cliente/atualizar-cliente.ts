// @cardapio/services/cliente/atualizar-cliente.ts
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { setCliente } from "@cardapio/stores/client/ClientStore";
import type { ClienteUpdate, ClienteOut } from "./types";

/**
 * Hook para atualizar um cliente
 * Endpoint: PUT /api/cadastros/client/clientes/me
 * 
 * @example
 * ```tsx
 * const atualizarCliente = useAtualizarCliente();
 * atualizarCliente.mutate({ id: 1, nome: "João Silva" });
 * ```
 */
export function useAtualizarCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  return useMutation({
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
}

