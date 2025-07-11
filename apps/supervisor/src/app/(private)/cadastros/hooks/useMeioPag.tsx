import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  atualizarConfigMeioPgto,
  atualizarDescricaoMeioPgto,
  fetchAllMeioPgto,
  fetchByIdMeioPgto,
  incluiMeioPgtoById
} from "../services/MeioPagtoService";
import { ConfiguracaoMeioPag, MeioPgto } from "../types/typesMeioPag";
import { useToast } from "@supervisor/hooks/use-toast";

//================== BUSCA POR ID ===================
export const useFetchByIdMeioPgto = (id: string) => {
  const { toast } = useToast();

  return useQuery<MeioPgto>({
    queryKey: ["fetchByIdMeioPgto", id],
    enabled: !!id,
    queryFn: async () => {
      try {
        return await fetchByIdMeioPgto(id);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao buscar!",
          description: error?.message || "Não foi possível carregar o meio de pagamento.",
        });
        throw error;
      }
    },
  });
};

//================== BUSCA TODOS ===================
export const useFetchAllMeiosPgto = () => {
  const { toast } = useToast();

  return useQuery<MeioPgto[]>({
    queryKey: ["fetchAllMeioPgto"],
    queryFn: async () => {
      try {
        return await fetchAllMeioPgto();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao buscar!",
          description: error?.message || "Não foi possível carregar os meios de pagamento.",
        });
        throw error;
      }
    },
  });
};

//================== ATUALIZA DESCRIÇÃO ===================
export const useAtualizarDescricaoMeioPgto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, novaDescricao }: { id: string; novaDescricao: string }) =>
      atualizarDescricaoMeioPgto(id, novaDescricao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllMeioPgto"] });
      toast({
        title: "Descrição atualizada!",
        description: "O meio de pagamento foi atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar!",
        description: error?.message || "Não foi possível atualizar a descrição.",
      });
    },
  });
};

//================== ATUALIZA CONFIGURAÇÕES ===================
export const useAtualizarConfigMpgto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (payload: ConfiguracaoMeioPag[]) => atualizarConfigMeioPgto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllMeioPgto"] });
      toast({
        title: "Configurações salvas!",
        description: "As configurações foram atualizadas com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro nas configurações!",
        description: error?.message || "Não foi possível salvar as configurações.",
      });
    },
  });
};

//================== INCLUI MEIO DE PAGAMENTO ===================
export const useIncluiMeioPgto = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ descricao, tipoMeioPgto }: { descricao: string; tipoMeioPgto: string }) =>
      incluiMeioPgtoById(descricao, tipoMeioPgto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllMeioPgto"] });
      toast({
        title: "Meio de pagamento incluído!",
        description: "Novo meio de pagamento adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      console.error("Erro ao incluir meio de pagamento:", error);
      toast({
        variant: "destructive",
        title: "Erro ao incluir!",
        description: error?.message || "Não foi possível adicionar o meio de pagamento.",
      });
    },
  });
};
