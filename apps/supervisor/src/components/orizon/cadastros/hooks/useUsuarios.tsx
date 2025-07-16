import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TypeUsuario, TypeUsuariosResponse } from "../types/typesUsuarios";
import { fetchAllUsers, postNewUser } from "../services/usuariosService";

// ========== BUSCA TODOS OS USUÁRIOS ==========
// =============================================
export const useFetchAllUsers = () => {
  return useQuery<TypeUsuariosResponse>({
    queryKey: ["fetchAllUsers"],
    queryFn: fetchAllUsers,
  });
};

// ============ INCLUI NOVO USUÁRIO ============
// =============================================
export const usePostNewUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TypeUsuario) => postNewUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllUsers"] });
    },
    onError: (error: any) => {
      console.error(`Erro ao Inserir Novo Usuário:`, error.message);
    },
  });
};
