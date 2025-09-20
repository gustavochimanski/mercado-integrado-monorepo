import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mensuraApi } from "@supervisor/api/MensuraApi";
import type { MeioPagamentoResponse, MeioPagamentoCreate, MeioPagamentoUpdate, MeioPagamentoTipoEnum } from "@supervisor/api";

import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessage";

// 🔎 Re-export dos tipos da API
export type { MeioPagamentoResponse as MeioPagamento } from "@supervisor/api";
export type { MeioPagamentoTipoEnum } from "@supervisor/api";

// ⏳ Debounce simples (se necessário)
// function useDebounced<T>(value: T, delay = 300) {
//   const [debounced, setDebounced] = React.useState(value);
//   React.useEffect(() => {
//     const t = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(t);
//   }, [value, delay]);
//   return debounced;
// }

// ✅ Buscar todos os meios de pagamento
export function useMeiosPagamento(enabled = true) {
  return useQuery({
    queryKey: ["meios_pagamento"],
    queryFn: () => mensuraApi.meiosDePagamentoAdmin.listarMeiosPagamentoAdminApiDeliveryMeiosPagamentoAdminGet(),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ✅ Mutations para criar, atualizar, deletar
export function useMutateMeioPagamento() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["meios_pagamento"] });
  };

  const create = useMutation({
    mutationFn: (data: MeioPagamentoCreate) =>
      mensuraApi.meiosDePagamentoAdmin.criarMeioPagamentoApiDeliveryMeiosPagamentoAdminPost(data),
    onSuccess: () => {
      toast({ title: "Meio de pagamento criado!", description: "O meio de pagamento foi criado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao criar meio de pagamento", description: getErrorMessage(err), variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MeioPagamentoUpdate }) =>
      mensuraApi.meiosDePagamentoAdmin.atualizarMeioPagamentoApiDeliveryMeiosPagamentoAdminMeioPagamentoIdPut(id, data),
    onSuccess: () => {
      toast({ title: "Meio de pagamento atualizado!", description: "O meio de pagamento foi atualizado com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao atualizar meio de pagamento", description: getErrorMessage(err), variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      mensuraApi.meiosDePagamentoAdmin.deletarMeioPagamentoApiDeliveryMeiosPagamentoAdminMeioPagamentoIdDelete(id),
    onSuccess: () => {
      toast({ title: "Meio de pagamento removido!", description: "O meio de pagamento foi removido com sucesso."});
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao remover meio de pagamento", description: getErrorMessage(err) , variant: "destructive" }),
  });

  return { create, update, remove };
}
