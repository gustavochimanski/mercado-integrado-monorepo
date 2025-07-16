import apiMensura from "@supervisor/lib/api/apiMensura";
import { CategoryResponse } from "@supervisor/types/routes/cadastros/categoriasDeliveryType";
import { useQuery } from "@tanstack/react-query";

export function useCategorias(empresaId: number) {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ["categorias-delivery", empresaId],
    queryFn: async () => {
      const { data } = await apiMensura.get("/mensura/categorias/delivery", {
        params: { empresaId },
      });
      return data;
    },
  });
}
