// src/services/useQueryEnderecoCliente.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import type { EnderecoOut } from "@supervisor/api/models/EnderecoOut";
import type { EditarPedidoRequest } from "@supervisor/api/models/EditarPedidoRequest";

// Hook para buscar todos os endereços de um cliente
export function useEnderecosCliente(clienteId?: number) {
  return useQuery({
    queryKey: ["enderecosCliente", clienteId],
    queryFn: async (): Promise<EnderecoOut[]> => {
      if (!clienteId) return [];

      // Usar a API mais adequada para listar endereços
      const response = await mensuraApi.endereOsAdminDelivery.listarEnderecosAdminApiDeliveryEnderecosAdminClienteClienteIdGet(clienteId);

      return response || [];
    },
    enabled: !!clienteId,
    staleTime: 2 * 60 * 1000, // 2 minutos - dados considerados frescos
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

      // Monta o payload com os dados atuais do pedido + novo endereço
      const payload: EditarPedidoRequest = {
        endereco_id: Number(enderecoId), // Garantir que é number
        observacao_geral: "", // Sempre enviar, mesmo que vazio
      };

      // Preserva outros campos do pedido se disponíveis
      if (pedidoCompleto) {
        if (pedidoCompleto.meio_pagamento?.id) {
          payload.meio_pagamento_id = Number(pedidoCompleto.meio_pagamento.id);
        }
        if (pedidoCompleto.observacao_geral) {
          payload.observacao_geral = String(pedidoCompleto.observacao_geral);
        }
        if (pedidoCompleto.troco_para !== undefined && pedidoCompleto.troco_para !== null) {
          payload.troco_para = Number(pedidoCompleto.troco_para);
        }
      }

      // Usa o endpoint correto para atualizar o pedido
      try {
        const response = await mensuraApi.pedidosAdminDelivery.atualizarPedidoApiDeliveryPedidosAdminPedidoIdPut(
          pedidoId,
          payload
        );

        return { success: true, data: response, enderecoId };
      } catch (err: any) {
        // Verificar se é um erro de região de entrega (regra de negócio válida)
        const errorMessage = err?.body?.detail || err?.response?.data?.detail || err?.message || '';
        const errorCode = err?.body?.code || err?.response?.data?.code;

        // Verificar por códigos de erro estruturados ou mensagens específicas
        if (errorCode === 'DELIVERY_AREA_NOT_COVERED' || 
            errorMessage?.toLowerCase().includes("não entregamos") || 
            errorMessage?.toLowerCase().includes("fora da área") ||
            errorMessage?.toLowerCase().includes("não atendemos")) {
          // Não é erro técnico, é regra de negócio - retornar com flag
          return {
            success: false,
            isDeliveryAreaError: true,
            message: errorMessage
          };
        }

        // Se for erro técnico real, logar e propagar
        console.error('Erro ao atualizar endereço do pedido:', err);
        console.error('Payload enviado:', payload);
        console.error('Erro completo:', err?.body || err?.response?.data || err);
        throw err;
      }
    },
    onMutate: async ({ pedidoId, enderecoId }) => {
      // Cancelar refetches em andamento
      await qc.cancelQueries({ queryKey: ["pedidoDetalhes", pedidoId] });

      // Snapshot do valor anterior para rollback em caso de erro
      const previousPedido = qc.getQueryData(["pedidoDetalhes", pedidoId]);

      // Optimistic update: atualizar cache imediatamente
      qc.setQueryData(["pedidoDetalhes", pedidoId], (old: any) => {
        if (!old) return old;

        // Buscar o endereço completo do cache de endereços do cliente
        const clienteId = old?.cliente?.id;
        const enderecosCache: EnderecoOut[] = qc.getQueryData(["enderecosCliente", clienteId]) || [];
        const novoEnderecoSelecionado = enderecosCache.find(e => e.id === enderecoId);

        if (!novoEnderecoSelecionado) return old;

        return {
          ...old,
          endereco: {
            ...old.endereco,
            endereco_selecionado: novoEnderecoSelecionado
          }
        };
      });

      return { previousPedido };
    },
    onError: (err: any, variables, context) => {
      // Reverter otimistic update em caso de erro
      if (context?.previousPedido) {
        qc.setQueryData(["pedidoDetalhes", variables.pedidoId], context.previousPedido);
      }

      const errorMessage = err?.body?.detail || err?.response?.data?.detail || getErrorMessage(err);

      toast({
        title: "Erro ao atualizar endereço",
        description: errorMessage,
        variant: "destructive"
      });
    },
    onSuccess: (result: any, variables) => {
      // Se foi erro de área de entrega (regra de negócio)
      if (result?.isDeliveryAreaError) {
        toast({
          title: "Região fora da área de entrega",
          description: result.message,
          variant: "default",
        });
        // Reverter otimistic update
        qc.invalidateQueries({ queryKey: ["pedidoDetalhes", variables.pedidoId] });
        return;
      }

      // Sucesso real - Invalidar cache (React Query refetch automaticamente)
      qc.invalidateQueries({
        queryKey: ["pedidoDetalhes", variables.pedidoId]
      });

      qc.invalidateQueries({
        queryKey: ["pedidosAdminKanban"],
        exact: false
      });

      toast({
        title: "Endereço atualizado",
        description: "O endereço de entrega foi atualizado com sucesso."
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
      // ✅ Usar o endpoint correto POST /criar-endereco
      const response = await mensuraApi.clienteAdminDelivery.criarEnderecoClienteApiDeliveryClienteAdminClienteIdCriarEnderecoPost(
        clienteId,
        enderecoData
      );
      return response;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Endereço criado",
        description: `Endereço #${data?.id || ''} criado com sucesso.`
      });

      // Invalida cache específico para o cliente
      qc.invalidateQueries({
        queryKey: ["enderecosCliente", variables.clienteId]
      });

      // Invalida cache de pedidos de forma mais específica
      qc.invalidateQueries({
        queryKey: ["pedidosAdminKanban"],
        exact: false
      });
    },
    onError: (err: any) => {
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
      // Usar a API de update do cliente, passando o endereço com acao: "update"
      const payload = {
        endereco: {
          ...enderecoData,
          acao: "update",
          id: enderecoId
        }
      };

      const response = await mensuraApi.clienteAdminDelivery.updateClienteAdminApiDeliveryClienteAdminUpdateClienteIdPut(
        clienteId,
        payload
      );
      return response;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso."
      });

      // Invalida cache específico para o cliente
      qc.invalidateQueries({ 
        queryKey: ["enderecosCliente", variables.clienteId] 
      });
      
      // Invalida cache de pedidos de forma mais específica
      qc.invalidateQueries({ 
        queryKey: ["pedidosAdminKanban"],
        exact: false 
      });
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao atualizar endereço",
        description: getErrorMessage(err),
        variant: "destructive"
      });
    },
  });
}