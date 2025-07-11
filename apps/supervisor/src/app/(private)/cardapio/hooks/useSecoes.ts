// src/services/useSubcategorias.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateSecaoDTO, SecaoDelivery } from "../types/subCategSecoesType";
import apiMensura from "@supervisor/lib/api/apiMensura";

// ✅ GET Subcategorias
export function useSubcategorias(empresaId: number, codCategoria?: number) {
  return useQuery<SecaoDelivery[]>({
    queryKey: ["subcategorias", empresaId, codCategoria],
    queryFn: async () => {
      const { data } = await apiMensura.get("/mensura/subcategorias/delivery", {
        params: {
          empresa_id: empresaId,
          ...(codCategoria ? { cod_categoria: codCategoria } : {}),
        },
      });
      return data;
    },
    enabled: !!empresaId,
  });
}

// ✅ POST Subcategoria
export const useCreateSubcategoria = () => {
  const queryClient = useQueryClient();

  return useMutation<SecaoDelivery, Error, Omit<CreateSecaoDTO, "id">>({
    mutationFn: async (body) => {
      const { data } = await apiMensura.post("/mensura/subcategorias/delivery", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategorias"], exact: false });
    },
  });
};

// ✅ DELETE Subcategoria
export const useDeleteSubcategoria = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (sub_id) => {
      await apiMensura.delete(`/mensura/subcategorias/delivery/${sub_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategorias"], exact: false });
    },
  });
};
