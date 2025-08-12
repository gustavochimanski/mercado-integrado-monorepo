import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Tipos alinhados ao backend
export type VitrineOut = {
  id: number;
  cod_categoria: number;
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

export type CreateVitrineDTO = {
  cod_categoria?: number | null;
  titulo: string;
  ordem?: number;
  is_home?: boolean;
  empresa_id: number
};

export function useFetchVitrine(empresaId: number, codCategoria?: number) {
  return useQuery<VitrineOut[]>({
    queryKey: ["vitrines", empresaId, codCategoria],
    queryFn: async () => {
      const { data } = await apiAdmin.get("api/delivery/vitrines", {
        params: {
          empresa_id: empresaId,
          ...(codCategoria ? { cod_categoria: codCategoria } : {}),
        },
      });
      return data as VitrineOut[];
    },
    enabled: !!empresaId,
    staleTime: 30_000,
  });
}

export function useMutateVitrine() {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };


  const create = useMutation({
    mutationFn: async (body: CreateVitrineDTO) => {
      const { data } = await apiAdmin.post("api/delivery/vitrines", body);
      return data as VitrineOut;
    },
    onSuccess: () => {
      toast.success("Vitrine criada com sucesso!");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao criar vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...body }: { id: number } & Partial<CreateVitrineDTO>) => {
      const { data } = await apiAdmin.put(`api/delivery/vitrines/${id}`, body);
      return data as VitrineOut;
    },
    onSuccess: () => {
      toast.success("Vitrine atualizada!");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao atualizar vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  const remove = useMutation({
    mutationFn: async (vitrineId: number) => {
      await apiAdmin.delete(`api/delivery/vitrines/${vitrineId}`);
    },
    onSuccess: () => {
      toast.success("Vitrine removida com sucesso!");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao remover vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  const vincular = useMutation({
    mutationFn: async (p: { vitrineId: number; empresa_id: number; cod_barras: string }) => {
      await apiAdmin.post(`api/delivery/vitrines/${p.vitrineId}/vincular`, {
        empresa_id: p.empresa_id,
        cod_barras: p.cod_barras,
      });
    },
    onSuccess: () => {
      toast.success("Produto vinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao vincular produto";
      toast.error(msg, { closeButton: true });
    },
  });

  const desvincular = useMutation({
    mutationFn: async (p: { vitrineId: number; empresa_id: number; cod_barras: string }) => {
      await apiAdmin.delete(`api/delivery/vitrines/${p.vitrineId}/vincular/${encodeURIComponent(p.cod_barras)}`, {
        params: { empresa_id: p.empresa_id },
      });
    },
    onSuccess: () => {
      toast.success("Produto desvinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao desvincular produto";
      toast.error(msg, { closeButton: true });
    },
  });

  return { create, update, remove, vincular, desvincular };
}
