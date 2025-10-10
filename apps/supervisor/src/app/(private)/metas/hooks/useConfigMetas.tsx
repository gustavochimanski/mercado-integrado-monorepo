import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TypeIncluirMetaRequest } from "../types/typeConfigMetas";
import { postNewMeta } from "../services/serviceConfigMetas";

export const usePostNewMeta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TypeIncluirMetaRequest) => postNewMeta(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllMetas"] });
    },
    onError: (error: any) => {
      console.error("Erro ao salvar nova meta:", error);
    },
  });
};
