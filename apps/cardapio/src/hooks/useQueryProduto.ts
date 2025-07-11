// src/services/useQueryProduto.ts

import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// === MUTATE NOVO PRODUTO ===
export function useMutateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await apiAdmin.post(
        "/mensura/produtos/delivery",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      // Invalida tudo que começar com "produtos"
      queryClient.invalidateQueries({ queryKey: ["produtos"], exact: false });
    },
    onError: (error) => {
      console.error("❌ Erro ao criar produto:", error);
    },
  });
}
