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

      const response = await mensuraApi.clienteAdminDelivery.getEnderecosClienteApiDeliveryClienteAdminClienteIdUpdateEnderecoGet(clienteId);
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
      enderecoId,
      pedidoCompleto
    }: {
      pedidoId: number;
      enderecoId: number;
      pedidoCompleto?: any;
    }) => {
      // Validações
      if (!pedidoId || pedidoId <= 0) {
        throw new Error('ID do pedido é obrigatório e deve ser maior que 0');
      }

      if (!enderecoId || enderecoId <= 0) {
        throw new Error('ID do endereço é obrigatório e deve ser maior que 0');
      }

      console.log('Atualizando endereço do pedido:', { pedidoId, enderecoId });

      // Monta o payload com os dados atuais do pedido + novo endereço
      const payload: any = {
        endereco_id: enderecoId,
      };

      // Preserva outros campos do pedido se disponíveis
      if (pedidoCompleto) {
        if (pedidoCompleto.meio_pagamento?.id) {
          payload.meio_pagamento_id = pedidoCompleto.meio_pagamento.id;
        }
        if (pedidoCompleto.observacao_geral) {
          payload.observacao_geral = pedidoCompleto.observacao_geral;
        }
        if (pedidoCompleto.troco_para !== undefined && pedidoCompleto.troco_para !== null) {
          payload.troco_para = pedidoCompleto.troco_para;
        }
      }

      // Usa o endpoint correto para atualizar o pedido
      try {
        const response = await mensuraApi.pedidosAdminDelivery.atualizarPedidoApiDeliveryPedidosAdminPedidoIdPut(
          pedidoId,
          payload
        );
        return { success: true, data: response };
      } catch (err: any) {
        // Verificar se é um erro de região de entrega (regra de negócio válida)
        const errorMessage = err?.body?.detail || err?.response?.data?.detail || err?.message || '';

        if (errorMessage?.includes("Não entregamos") || errorMessage?.includes("não entregamos")) {
          // Não é erro técnico, é regra de negócio - retornar com flag
          return {
            success: false,
            isDeliveryAreaError: true,
            message: errorMessage
          };
        }

        // Se for erro técnico real, propagar
        throw err;
      }
    },
    onSuccess: (result: any) => {
      // Se foi erro de área de entrega (regra de negócio)
      if (result?.isDeliveryAreaError) {
        toast({
          title: "Região fora da área de entrega",
          description: result.message,
          variant: "default",
        });
        return;
      }

      // Sucesso real
      toast({
        title: "Endereço atualizado",
        description: "O endereço de entrega foi atualizado com sucesso."
      });

      // Invalida cache relacionado
      qc.invalidateQueries({ queryKey: ["pedidoDetalhes"], exact: false });
      qc.invalidateQueries({ queryKey: ["enderecosCliente"], exact: false });
    },
    onError: (err: any) => {
      // Apenas erros técnicos reais chegam aqui
      console.error("Erro técnico ao atualizar endereço:", err);

      const errorMessage = err?.body?.detail || err?.response?.data?.detail || getErrorMessage(err);

      toast({
        title: "Erro ao atualizar endereço",
        description: errorMessage,
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