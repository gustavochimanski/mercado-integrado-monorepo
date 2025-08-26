// @cardapio/services/useQueryVitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CategoriaMini } from "./useQueryHome";

// Tipos alinhados ao backend
export type VitrineOut = {
  id: number;
  cod_categoria: number; // se houver chance de null no back, mude para number | null
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

export type CreateVitrinePayload = {
  cod_categoria: number;
  titulo: string;
  ordem?: number;
  is_home?: boolean;
};

type CreateVitrineDTO = CreateVitrinePayload & { empresa_id?: number };

export type VitrineSearchItem = {
  id: number;
  cod_categoria: number | null;
  titulo: string;
  slug: string;
  ordem: number;
  is_home: boolean;
};

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}



export function useVitrinesSearch(
  q: string,
  opts?: {
    codCategoria?: number | null;
    isHome?: boolean | null;
    limit?: number;
    offset?: number;
    debounceMs?: number;
    enabled?: boolean;
  }
) {
  const {
    codCategoria = null,
    isHome = null,
    limit = 30,
    offset = 0,
    debounceMs = 300,
    enabled,
  } = opts ?? {};

  const qDeb = useDebounced(q, debounceMs);

  const hasCat   = codCategoria != null;
  const hasQuery = typeof qDeb === "string" && qDeb.trim().length > 0;

  return useQuery({
    queryKey: ["vitrines_search", qDeb, codCategoria, isHome, limit, offset],
    queryFn: async () => {
      const params: Record<string, any> = { limit, offset };
      if (hasQuery) params.q = qDeb.trim();
      if (codCategoria != null) params.cod_categoria = codCategoria;
      if (isHome != null) params.is_home = isHome;
      const { data } = await apiAdmin.get<VitrineSearchItem[]>("api/delivery/vitrines/search", { params });
      return data;
    },
    enabled: enabled ?? (hasCat || hasQuery),
    staleTime: 10 * 60 * 1000,
  });

}

/**
 * Opção A (recomendada): usa /search para listar vitrines filtrando por categoria
 * Se você preferir manter o GET /api/delivery/vitrines, veja a opção B no router abaixo.
 */
export function useFetchVitrine(empresaId: number, codCategoria?: number) {
  return useQuery<VitrineOut[]>({
    queryKey: ["vitrines", empresaId, codCategoria],
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (codCategoria) params.cod_categoria = codCategoria;

      const { data } = await apiAdmin.get<VitrineOut[]>(
        "api/delivery/vitrines/search",
        { params }
      );
      return data;
    },
    enabled: !!empresaId, // e opcionalmente: && !!codCategoria
    staleTime: 60_000, // 1 min
  });
}

export function useMutateVitrine() {
  const qc = useQueryClient();
  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
    qc.invalidateQueries({ queryKey: ["vitrines_search"], exact: false });
  };

    const reloadPage = () => {
    invalidateAll();
    window.location.reload();
  };

  const create = useMutation({
    mutationFn: async (body: CreateVitrineDTO) => {
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
      await apiAdmin.delete(
        `api/delivery/vitrines/${p.vitrineId}/vincular/${encodeURIComponent(p.cod_barras)}`,
        { params: { empresa_id: p.empresa_id } }
      );
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

  const markHome = useMutation({
    mutationFn: async ({ id, is_home }: { id: number; is_home: boolean }) => {
      const { data } = await apiAdmin.patch(`api/delivery/vitrines/${id}/home`, { is_home });
      return data as VitrineOut;
    },
    onSuccess: (v) => {
      toast.success(v.is_home ? "Vitrine marcada como destaque da Home!" : "Vitrine removida da Home.");
      reloadPage();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || "Erro ao atualizar destaque da vitrine";
      toast.error(msg, { closeButton: true });
    },
  });

  return { create, update, remove, vincular, desvincular, markHome };
}
