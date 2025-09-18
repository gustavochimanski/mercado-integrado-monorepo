import apiAdmin from "@cardapio/app/api/apiAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CategoriaMini } from "./useQueryHome";
import React from "react";

interface CreateCategoriaBody {
  descricao: string;
  cod_empresa: number;
  parent_id?: number | null;
  slug?: string;
  posicao?: number;
}

interface UpdateCategoriaBody extends CreateCategoriaBody {
  id: number;
}

interface UploadImagemBody {
  id: number;
  cod_empresa: number;
  imagem: File;
}


/** 🔎 Tipo do resultado do endpoint /api/delivery/categorias/search */
export interface CategoriaSearchItem {
  id: number;
  descricao: string;
  slug: string;
  parent_id: number | null;
  slug_pai: string | null;
  imagem?: string | null;
}

/** ⏳ debounce simples para evitar flood no servidor enquanto digita */
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ✅ Hook para buscar por ID
export function useCategoriaById(catId: number | null, opts?: { enabled?: boolean }) {
  const qc = useQueryClient();
  const seed = catId ? qc.getQueryData<CategoriaMini>(["categoria", catId]) : undefined;

  return useQuery({
    queryKey: ["categoria", catId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<CategoriaMini>(`/delivery/categorias/${catId}`);
      return data;
    },
    initialData: seed,                             // usa cache se já tiver
    enabled: !!catId && (opts?.enabled ?? true),  // 🔑 só quando abrir
    refetchOnMount: false,                         // não refaz à toa
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/** 🔎 Buscar TODAS as categorias (raiz + filhas) com filtro q (server-side) */
// ✅ versão definitiva
export function useCategoriasSearch(
  q: string,
  opts: {
    limit?: number;
    offset?: number;
    enabled?: boolean;   // ex.: modal aberto
    minLength?: number;  // quantos chars mínimos p/ buscar
    debounceMs?: number; // debounce em ms
    allowEmpty?: boolean;// se true, busca mesmo com q vazio (geralmente false)
  } = {}
) {
  const {
    limit = 30,
    offset = 0,
    enabled = true,
    minLength = 2,
    debounceMs = 300,
    allowEmpty = false,
  } = opts;

  const qDeb = useDebounced(q ?? "", debounceMs);
  const hasTerm = qDeb.trim().length >= minLength;
  const canRun = enabled && (allowEmpty || hasTerm);

  return useQuery({
    queryKey: ["categorias_search", allowEmpty ? qDeb : hasTerm ? qDeb : "", limit, offset],
    queryFn: async () => {
      const params: Record<string, any> = { limit, offset };
      if (allowEmpty || hasTerm) params.q = qDeb.trim(); // não manda q vazio
      const { data } = await apiAdmin.get<CategoriaSearchItem[]>(
        "/delivery/categorias/search",
        { params }
      );
      return data;
    },
    enabled: canRun,                 // 🔑 só busca quando deve
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (old) => old,   // evita flicker
  });
}


export function useMutateCategoria() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
    qc.invalidateQueries({ queryKey: ["categorias_search"] }); // 👈 invalida também o search
  };

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };

  const create = useMutation({
    mutationFn: (body: CreateCategoriaBody) => apiAdmin.post("/delivery/categorias", body),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const update = useMutation({
    mutationFn: ({ id, ...body }: UpdateCategoriaBody) =>
      apiAdmin.put(`/delivery/categorias/${id}`, body),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const uploadImagem = useMutation({
    mutationFn: ({ id, cod_empresa, imagem }: UploadImagemBody) => {
      const fd = new FormData();
      fd.append("cod_empresa", String(cod_empresa));
      fd.append("imagem", imagem);
      return apiAdmin.patch(`/delivery/categorias/${id}/imagem`, fd);
    },
    onSuccess: () => {
      toast.success("Imagem atualizada!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const remove = useMutation({
    mutationFn: (id: number) => apiAdmin.delete(`/delivery/categorias/${id}`),
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const moveRight = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`/delivery/categorias/${id}/move-right`),
    onSuccess: () => {
      toast.success("Categoria movida para a direita!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const moveLeft = useMutation({
    mutationFn: (id: number) => apiAdmin.post(`/delivery/categorias/${id}/move-left`),
    onSuccess: () => {
      toast.success("Categoria movida para a esquerda!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return { create, update, uploadImagem, remove, moveRight, moveLeft };
}
