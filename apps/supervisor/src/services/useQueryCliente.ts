// src/services/useQueryCliente.ts
import { mensuraApi } from "@supervisor/api/MensuraApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  ativo: boolean;
  super_token: string;
  created_at: string;
  updated_at: string;
}

interface ClienteResponse {
  data: Cliente[];
  total?: number;
}

export function useFetchClientes() {
  return useQuery<ClienteResponse>({
    queryKey: ["clientes"],
    queryFn: async () => {
      // Usar o cliente gerado que não tem problema de CORS
      const res = await mensuraApi.clienteAdminDelivery.listarClientesApiDeliveryClienteAdminGet();
      
      const data: Cliente[] = res.map((cliente: any) => ({
        id: cliente.id,
        nome: cliente.nome,
        cpf: cliente.cpf ?? "",
        telefone: cliente.telefone,
        email: cliente.email,
        data_nascimento: cliente.data_nascimento,
        ativo: cliente.ativo,
        super_token: cliente.super_token,
        created_at: cliente.created_at,
        updated_at: cliente.updated_at,
      }));
      return { data };
    },
  });
}

export type CreateClienteInput = {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string; // YYYY-MM-DD
};

export function useMutateCliente() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const create = useMutation({
    mutationFn: async (input: CreateClienteInput) => {
      try {
        // Usar o cliente gerado que não tem problema de CORS
        const data = await mensuraApi.clienteAdminDelivery.criarClienteApiDeliveryClienteAdminPost({
          nome: input.nome.trim(),
          cpf: input.cpf.trim(),
          telefone: input.telefone.trim(),
          email: input.email.trim(),
          data_nascimento: input.data_nascimento,
        });
        toast({ title: "Cliente criado", description: "O cliente foi criado com sucesso." });
        return data;
      } catch (err: any) {
        toast({ title: "Erro ao criar cliente", description: getErrorMessage(err), variant: "destructive" });
        throw err;
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["clientes"], exact: false });
    },
  });

  const update = useMutation({
    mutationFn: async (data: any) => {
      // TODO: Implementar quando tiver endpoint
      throw new Error("Endpoint de atualizar cliente ainda não implementado");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["clientes"], exact: false });
    },
  });

        const remove = useMutation({
          mutationFn: async (clienteId: number) => {
            try {
              await mensuraApi.clienteAdminDelivery.deletarClienteApiDeliveryClienteAdminClienteIdDelete(clienteId);
              toast({ title: "Cliente excluído", description: "O cliente foi excluído com sucesso." });
            } catch (err: any) {
              toast({ title: "Erro ao excluir cliente", description: getErrorMessage(err), variant: "destructive" });
              throw err;
            }
          },
          onSettled: () => {
            qc.invalidateQueries({ queryKey: ["clientes"], exact: false });
          },
        });

        return { create, update, remove };
}