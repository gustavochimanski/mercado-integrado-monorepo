import { useMutation } from "@tanstack/react-query";
import { postHeaderDashboard } from "../services/serviceDashboard";
import { TypeFiltroDashboard } from "../types/typeDashboard";
import { toast } from "@supervisor/hooks/use-toast";

export const usePostDashboard = () => {
  return useMutation({
    mutationFn: (payload: TypeFiltroDashboard) => postHeaderDashboard(payload),
    onError: (error: Error) => {
      toast({
        title: "Erro ao buscar dashboard",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
