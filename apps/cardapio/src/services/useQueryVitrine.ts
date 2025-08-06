// src/services/useQuerySubcategoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { VitrineDelivery, CreateVitrineDTO } from "@cardapio/types/vitrinesTypes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ✅ GET Subcategorias
export function useFetchVitrine(empresaId: number, codCategoria?: number) {
  return useQuery<VitrineDelivery[]>({
    queryKey: ["vitrines", empresaId, codCategoria],
    queryFn: async () => {
      const { data } = await apiAdmin.get("/delivery/vitrines/delivery", {
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

// ✅ CREATE / DELETE vitrine
export function useMutateVitrine() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (body: Omit<CreateVitrineDTO, "id">) => {
      const { data } = await apiAdmin.post("/delivery/vitrines/delivery", body);
      return data;
    },
    onSuccess: () => {
      toast.success("Vitrine criada com sucesso!");
      qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
      setTimeout(() => window.location.reload(), 800);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message || "Erro ao criar vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  const remove = useMutation({
    mutationFn: async (vitrineId: number) => {
      await apiAdmin.delete(`/delivery/vitrines/delivery/${vitrineId}`);
    },
    onSuccess: () => {
      toast.success("Vitrine removida com sucesso!");
      qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
      setTimeout(() => window.location.reload(), 800);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || err.message || "Erro ao remover Vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  return { create, remove };
}
