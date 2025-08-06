import apiAdmin from "@cardapio/app/api/apiAdmin";
import { CategoryApi } from "../../types/categoriasDeliveryType";
import { useQuery } from "@tanstack/react-query";


export function useCategorias() {
  return useQuery<CategoryApi[]>({
    queryKey: ["categorias_planas"],
    queryFn: async () => {
      const res = await apiAdmin.get("/delivery/categorias/delivery");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
