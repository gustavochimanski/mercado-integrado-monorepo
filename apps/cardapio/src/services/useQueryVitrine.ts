// @cardapio/services/useQueryVitrine.ts
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

// Payload que o backend realmente aceita
export type CreateVitrinePayload = {
  cod_categoria: number;           // obrigatório
  titulo: string;
  ordem?: number;
  is_home?: boolean;
};

// Permite receber empresa_id do app, mas não envia para o backend
type CreateVitrineDTO = CreateVitrinePayload & { empresa_id?: number };

export function useFetchVitrine(empresaId: number, codCategoria?: number) {
  return useQuery<VitrineOut[]>({
    queryKey: ["vitrines", empresaId, codCategoria],
    queryFn: async () => {
      const { data } = await apiAdmin.get("api/delivery/vitrines", {
        params: {
          empresa_id: empresaId,                      // se seu GET usa isso, mantém
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
  const invalidate = () => qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };

  const create = useMutation({
    mutationFn: async (body: CreateVitrineDTO) => {
      // envia apenas o que o backend aceita
      const payload: CreateVitrinePayload = {
        cod_categoria: body.cod_categoria,
        titulo: body.titulo,
        ...(typeof body.ordem === "number" ? { ordem: body.ordem } : {}),
        ...(typeof body.is_home === "boolean" ? { is_home: body.is_home } : {}),
      };
      const { data } = await apiAdmin.post("api/delivery/vitrines", payload);
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
    // aceita alteração de cod_categoria; ignora empresa_id
    mutationFn: async ({ id, ...body }: { id: number } & Partial<CreateVitrineDTO>) => {
      const payload: Partial<CreateVitrinePayload> = {
        ...(typeof body.cod_categoria === "number" ? { cod_categoria: body.cod_categoria } : {}),
        ...(typeof body.titulo === "string" ? { titulo: body.titulo } : {}),
        ...(typeof body.ordem === "number" ? { ordem: body.ordem } : {}),
        ...(typeof body.is_home === "boolean" ? { is_home: body.is_home } : {}),
      };
      const { data } = await apiAdmin.put(`api/delivery/vitrines/${id}`, payload);
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
