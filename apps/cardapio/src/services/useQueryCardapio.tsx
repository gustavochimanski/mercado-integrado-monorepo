import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoriaComProdutos } from "../types/CardapioTypes";
import { api } from "../app/api/api";
import { ProdutoEmpMini } from "@cardapio/types/Produtos";

// Hook para buscar o cardápio completo
export function useCardapio(empresa_id: number) {
  return useQuery<CategoriaComProdutos[], Error>({
    queryKey: ["categorias-delivery", empresa_id],
    queryFn: async () => {
      try {
        const { data } = await api.get("/delivery/cardapio", {
          params: { empresa_id },
        });
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Erro ao carregar o cardápio";
        toast.error(msg);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Tipagem da vitrine por categoria
export interface VitrineComProdutos {
  id: number;
  titulo: string;
  produtos: ProdutoEmpMini[];
}

// Hook para buscar produtos da vitrine por categoria
export function useProdutosVitrinePorCategoria(codCategoria: number, empresa_id: number, is_home: boolean = false) {
  return useQuery<VitrineComProdutos[]>({
    queryKey: ["produtos-vitrine-categoria", codCategoria],
    queryFn: async () => {
      try {
        const { data } = await api.get("/mensura/produtos/vitrine-por-categoria", {
          params: {
            cod_categoria: codCategoria,
            empresa_id: empresa_id,
            is_home: is_home
          },
        });
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Erro ao carregar vitrine da categoria";
        toast.error(msg);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
