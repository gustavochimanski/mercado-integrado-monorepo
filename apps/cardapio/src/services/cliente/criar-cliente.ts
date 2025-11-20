// @cardapio/services/cliente/criar-cliente.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { setCliente } from "@cardapio/stores/client/ClientStore";
import type { ClienteCreate, ClienteOut } from "./types";

/**
 * Hook para criar um novo cliente
 * Endpoint: POST /api/cadastros/client/clientes/
 * 
 * @example
 * ```tsx
 * const criarCliente = useCriarCliente();
 * criarCliente.mutate({ nome: "João", telefone: "11999999999" });
 * ```
 */
export function useCriarCliente() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["cliente", "current"] });
  };

  return useMutation({
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
      toast.success("Cliente criado com sucesso!");
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error));
    },
  });
}

