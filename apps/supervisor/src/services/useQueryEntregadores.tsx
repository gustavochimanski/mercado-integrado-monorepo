import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import apiMensura from "@supervisor/lib/api/apiMensura";
import { useToast } from "@supervisor/hooks/use-toast";
import { getErrorMessage } from "@supervisor/lib/getErrorMessageOrizon";

export interface Entregador {
  id: number;
  nome: string;
  ativo: boolean;
  telefone?: string;
  documento?: string;
  veiculo_tipo?: string;
  placa?: string;
  acrescimo_taxa?: number;
  created_at: string;
  updated_at: string;
}

export function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// Buscar todos os entregadores
export function useEntregadores(enabled = true) {
  return useQuery<Entregador[]>({
    queryKey: ["entregadores"],
    queryFn: async () => {
      const { data } = await apiMensura.get<Entregador[]>("/api/delivery/entregadores");
      return data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// Mutations
export function useMutateEntregador() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const invalidate = () => qc.invalidateQueries({ queryKey: ["entregadores", "empresas"] });

  type EntregadorCreatePayload = {
    nome: string;
    empresa_id: number; // NOVO
    ativo?: boolean; // opcional, caso queira controlar
    telefone?: string;
    documento?: string;
    veiculo_tipo?: string;
    placa?: string;
    acrescimo_taxa?: number;
  };


  type EntregadorUpdatePayload = Partial<Omit<Entregador, "id" | "created_at" | "updated_at">> & { id: number };

  const create = useMutation({
    mutationFn: (body: EntregadorCreatePayload) => apiMensura.post("/api/delivery/entregadores", body),
    onSuccess: (_data, variables) => {
      toast({ title: "Entregador criado!", description: `O entregador "${variables.nome}" foi criado.` });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao criar entregador", description: getErrorMessage(err), variant: "destructive" }),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: EntregadorUpdatePayload) => apiMensura.put(`/api/delivery/entregadores/${id}`, body),
    onSuccess: (_data, variables) => {
      toast({ title: "Entregador atualizado!", description: `O entregador "${variables.nome}" foi atualizado.` });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao atualizar entregador", description: getErrorMessage(err), variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiMensura.delete(`/api/delivery/entregadores/${id}`),
    onSuccess: () => {
      toast({ title: "Entregador removido!", description: "O entregador foi removido com sucesso." });
      invalidate();
    },
    onError: (err) =>
      toast({ title: "Erro ao remover entregador", description: getErrorMessage(err), variant: "destructive" }),
  });

  const vincularEmpresa = useMutation({
    mutationFn: ({ entregador_id, empresa_id }: { entregador_id: number; empresa_id: number }) =>
      apiMensura.post(`/api/delivery/entregadores/${entregador_id}/vincular_empresa`, null, {
        params: { empresa_id },
      }),
    onSuccess: (_data, variables) => {
      toast({
        title: "Entregador vinculado!",
        description: `O entregador foi vinculado à empresa ${variables.empresa_id}.`,
      });
      invalidate();
    },
    onError: (err) =>
      toast({
        title: "Erro ao vincular entregador",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });

  const desvincularEmpresa = useMutation({
    mutationFn: ({ entregador_id, empresa_id }: { entregador_id: number; empresa_id: number }) =>
      apiMensura.delete(`/api/delivery/entregadores/${entregador_id}/vincular_empresa`, {
        params: { empresa_id },
      }),
    onSuccess: (_data, variables) => {
      toast({
        title: "Entregador desvinculado!",
        description: `O entregador foi desvinculado da empresa ${variables.empresa_id}.`,
      });
      invalidate(); 
    },
    onError: (err) =>
      toast({
        title: "Erro ao desvincular entregador",
        description: getErrorMessage(err),
        variant: "destructive",
      }),
  });



  return { create, update, remove, vincularEmpresa, desvincularEmpresa };
}
