import apiMensura from "@supervisor/lib/api/apiMensura";
import { CategoryApi } from "../types/categoriasDeliveryType";
import { useQuery } from "@tanstack/react-query";


export function useCategorias() {
  return useQuery<CategoryApi[]>({
    queryKey: ["categorias_planas"],
    queryFn: async () => {
      const res = await apiMensura.get("/mensura/categorias/delivery");
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
