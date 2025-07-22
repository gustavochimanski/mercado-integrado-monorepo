// src/services/useQuerySubcategoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { CreateSecaoDTO, SecaoDelivery } from "@cardapio/types/subCategSecoesType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ✅ GET Subcategorias
export function useFetchSubcategorias(empresaId: number, codCategoria?: number) {
  return useQuery<SecaoDelivery[]>({
    queryKey: ["subcategorias", empresaId, codCategoria],
    queryFn: async () => {
      const { data } = await apiAdmin.get("/mensura/subcategorias/delivery", {
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

// ✅ CREATE / DELETE Subcategoria
export function useMutateSubcategoria() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (body: Omit<CreateSecaoDTO, "id">) => {
      const { data } = await apiAdmin.post("/mensura/subcategorias/delivery", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Subcategoria criada com sucesso!");
      qc.invalidateQueries({ queryKey: ["subcategorias"], exact: false });
      setTimeout(() => window.location.reload(), 800);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message || "Erro ao criar subcategoria";
      toast.error(msg, { closeButton: true });
    },
  });

  const remove = useMutation({
    mutationFn: async (subcategoriaId: number) => {
      await apiAdmin.delete(`/mensura/subcategorias/delivery/${subcategoriaId}`);
    },
    onSuccess: () => {
      toast.success("Subcategoria removida com sucesso!");
      qc.invalidateQueries({ queryKey: ["subcategorias"], exact: false });
      setTimeout(() => window.location.reload(), 800);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message || "Erro ao remover subcategoria";
      toast.error(msg, { closeButton: true });
    },
  });

  return { create, remove };
}
