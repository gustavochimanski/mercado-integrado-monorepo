// src/services/useQueryEnderecoCliente.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import type { EnderecoOut } from "@supervisor/api/models/EnderecoOut";

// Hook para buscar todos os endereços de um cliente
export function useEnderecosCliente(clienteId?: number) {
  return useQuery({
    queryKey: ["enderecosCliente", clienteId],
    queryFn: async (): Promise<EnderecoOut[]> => {
      if (!clienteId) return [];

      const response = await mensuraApi.clienteAdminDelivery.getEnderecosClienteApiDeliveryClienteAdminClienteIdEnderecosGet(clienteId);
      return response || [];
    },
    enabled: !!clienteId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook para atualizar endereço do pedido (selecionar novo endereço para entrega)
export function useUpdateEnderecoEntrega() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      pedidoId,
      enderecoId
    }: {
      pedidoId: number;
      enderecoId: number;
    }) => {
      // Usa o endpoint correto para atualizar o pedido
      const response = await mensuraApi.pedidosAdminDelivery.atualizarPedidoApiDeliveryPedidosAdminPedidoIdPut(
        pedidoId,
        {
          endereco_id: enderecoId
        }
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Endereço atualizado",
        description: "O endereço de entrega foi atualizado com sucesso."
      });

      // Invalida cache relacionado
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false });
      qc.invalidateQueries({ queryKey: ["enderecosCliente"], exact: false });
    },
    onError: (err: any) => {
      console.error("Error updating delivery address:", err);
      toast({
        title: "Erro ao atualizar endereço",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    },
  });
}

// Hook para criar novo endereço para o cliente
export function useCreateEnderecoCliente() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      clienteId,
      enderecoData
    }: {
      clienteId: number;
      enderecoData: any;
    }) => {
      const response = await mensuraApi.endereOsAdminDelivery.criarEnderecoAdminApiDeliveryEnderecosAdminClienteClienteIdPost(
        clienteId,
        enderecoData
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Endereço criado",
        description: "O novo endereço foi criado com sucesso."
      });

      // Invalida cache para recarregar a lista
      qc.invalidateQueries({ queryKey: ["enderecosCliente"], exact: false });
    },
    onError: (err: any) => {
      console.error("Error creating address:", err);
      toast({
        title: "Erro ao criar endereço",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    },
  });
}

// Hook para atualizar endereço existente
export function useUpdateEnderecoCliente() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      clienteId,
      enderecoId,
      enderecoData
    }: {
      clienteId: number;
      enderecoId: number;
      enderecoData: any;
    }) => {
      const response = await mensuraApi.endereOsAdminDelivery.atualizarEnderecoAdminApiDeliveryEnderecosAdminClienteClienteIdEnderecoEnderecoIdPut(
        clienteId,
        enderecoId,
        enderecoData
      );
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso."
      });

      // Invalida cache para recarregar a lista
      qc.invalidateQueries({ queryKey: ["enderecosCliente"], exact: false });
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false });
    },
    onError: (err: any) => {
      console.error("Error updating address:", err);
      toast({
        title: "Erro ao atualizar endereço",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    },
  });
}