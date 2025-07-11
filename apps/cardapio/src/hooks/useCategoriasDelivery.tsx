// src/hooks/useCategoriasDelivery.ts
import { fetchCategoriasDelivery } from "../services/categoriasDeliveryService";
import { CategoriaComProdutos } from "../types/Categorias";
import { useQuery } from "@tanstack/react-query";

export function useCategoriasDelivery(empresaId: number) {
  return useQuery<CategoriaComProdutos[], Error>({
    queryKey: ["categorias-delivery", empresaId],
    queryFn: () => fetchCategoriasDelivery(empresaId),
    staleTime: 1000 * 60,
  });
}
