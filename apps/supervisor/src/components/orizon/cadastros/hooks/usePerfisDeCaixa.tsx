import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllPerfis,
  fetchPerfilById,
  deletePerfilById,
  postNewPerfilPdv,
  putConfPerfilById,
  patchAlteraDescricaoById
} from "../services/PerfilDeCaixaService";
import { PatchConfPerfilPayload, TypePerfilPdv } from '../types/typesPDVS';

//================== BUSCA TODOS OS PERFIS ==================
export const useFetchAllPerfil = () => {
  return useQuery<TypePerfilPdv[]>({
    queryKey: ["fetchAllPerfilPdvs"],
    queryFn: fetchAllPerfis,
    staleTime: 60 * 1000,
  });
};

//================== BUSCA POR ID ==================
export const useFetchByIdPerfil = (id: string | undefined) => {
  return useQuery<TypePerfilPdv>({
    queryKey: ["fetchPerfilPdvById", id],
    queryFn: () => fetchPerfilById(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
};

//================== INSERE PERFIL ==================
export const usePostNewPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (descricao: string) => postNewPerfilPdv(descricao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllPerfilPdvs"] });
    },
  });
};

//================== DELETA PERFIL ==================
export const useDelPerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePerfilById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllPerfilPdvs"] });
    },
  });
};

//================== ATUALIZA CONFIGURAÇÕES ==================
export const usePutConfPerfilPdv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ idPerfil, payloadArray }: { idPerfil: string; payloadArray: PatchConfPerfilPayload[] }) => {
      for (const payload of payloadArray) {
        await putConfPerfilById(idPerfil, payload);
      }
    },
    onSuccess: () => {
      console.log('Todas as configurações foram atualizadas com sucesso');
      queryClient.invalidateQueries({ queryKey: ["fetchAllPerfilPdvs"] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar as configurações:', error);
    },
  });
};

//================== ATUALIZA DESCRIÇÃO ==================
export const usePutAlteraDescricao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idPerfil, descricao }: { idPerfil: string; descricao: string }) =>
      patchAlteraDescricaoById(idPerfil, descricao),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllPerfilPdvs"] });
    },
  });
};
