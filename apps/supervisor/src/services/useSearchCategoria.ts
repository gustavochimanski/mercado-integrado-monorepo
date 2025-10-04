import apiMensura from "@supervisor/lib/api/apiMensura";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export type CategoriaMini = {
  id: number;
  slug: string;
  parent_id: number | null;
  descricao: string;
  posicao: number;
  imagem: string | null;
  label: string;
  href: string;
  slug_pai: string | null;
};

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
    minLength = 0,
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
      const { data } = await apiMensura.get<CategoriaSearchItem[]>(
        "/api/delivery/categorias/admin/search",
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