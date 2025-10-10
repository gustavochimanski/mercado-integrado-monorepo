import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import type { RegiaoEntregaCreate, RegiaoEntregaUpdate } from "@supervisor/api";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";

export type { RegiaoEntregaOut as RegiaoEntrega } from "@supervisor/api";

export function useRegioesEntrega(empresaId: number) {
  return useQuery({
    queryKey: ["regioes-entrega", empresaId],
    queryFn: () => mensuraApi.regiEsDeEntregaAdminDelivery.listRegioesApiDeliveryRegioesEntregaEmpresaIdGet(empresaId),
    enabled: !!empresaId,
  });
}

export function useMutateRegiaoEntrega() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["regioes-entrega"] });
  };

  const create = useMutation({
    mutationFn: (data: RegiaoEntregaCreate) =>
      mensuraApi.regiEsDeEntregaAdminDelivery.createRegiaoApiDeliveryRegioesEntregaPost(data),
    onSuccess: () => {
      toast({
        title: "Região de entrega criada!",
        description: "A região de entrega foi criada com sucesso."
      });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao criar região de entrega",
        description: getErrorMessage(err),
        variant: "destructive"
      }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: RegiaoEntregaUpdate }) =>
      mensuraApi.regiEsDeEntregaAdminDelivery.updateRegiaoApiDeliveryRegioesEntregaRegiaoIdPut(id, data),
    onSuccess: () => {
      toast({
        title: "Região de entrega atualizada!",
        description: "A região de entrega foi atualizada com sucesso."
      });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao atualizar região de entrega",
        description: getErrorMessage(err),
        variant: "destructive"
      }),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      mensuraApi.regiEsDeEntregaAdminDelivery.deleteRegiaoApiDeliveryRegioesEntregaRegiaoIdDelete(id),
    onSuccess: () => {
      toast({
        title: "Região de entrega removida!",
        description: "A região de entrega foi removida com sucesso."
      });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao remover região de entrega",
        description: getErrorMessage(err),
        variant: "destructive"
      }),
  });

  return { create, update, remove };
}