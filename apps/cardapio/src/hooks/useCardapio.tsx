import { useQuery } from "@tanstack/react-query";
import { CategoriaComProdutos } from "../types/CardapioTypes";
import { api } from "../app/api/api";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

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



export interface VitrineComProdutos {
  id: number;
  titulo: string;
  produtos: ProdutoEmpMini[];
}

export function useProdutosVitrinePorCategoria(codCategoria: number, empresaId: number) {
  return useQuery<VitrineComProdutos[]>({
    queryKey: ["produtos-vitrine-categoria", codCategoria],
    queryFn: async () => {
      const { data } = await api.get("/mensura/produtos/vitrine-por-categoria", {
        params: {
          cod_categoria: codCategoria,
          cod_empresa: empresaId,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}