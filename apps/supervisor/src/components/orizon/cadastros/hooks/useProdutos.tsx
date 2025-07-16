import { useQuery } from "@tanstack/react-query";
import { fetchProdutos } from "../services/ProdutosService";

export const useFetchProdutos = () => {
  return useQuery({
    queryKey: ["produtos"],
    queryFn: fetchProdutos,
    staleTime: 60 * 1000, // cache de 1 minuto
  });
};
