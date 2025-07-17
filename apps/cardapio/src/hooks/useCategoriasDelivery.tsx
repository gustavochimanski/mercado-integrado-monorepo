import { useQuery } from "@tanstack/react-query";
import { CategoriaComProdutos } from "../types/CardapioTypes";
import { api } from "../app/api/api";

export function useCardapio(empresaId: number) {
  return useQuery<CategoriaComProdutos[], Error>({
    queryKey: ["categorias-delivery", empresaId],
    queryFn: async () => {
      const { data } = await api.get("/mensura/cardapio", {
        params: { empresaId },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
