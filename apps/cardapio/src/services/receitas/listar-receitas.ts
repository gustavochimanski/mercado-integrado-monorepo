// @cardapio/services/receitas/listar-receitas.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { ReceitaApiResponse, ReceitaListItem } from "./types";

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

interface UseListarReceitasOptions {
  search?: string; // Termo de busca opcional (busca em nome e descrição)
  ativo?: boolean; // Filtrar por status ativo
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook para listar receitas com busca opcional
 * Endpoint: GET /api/catalogo/admin/receitas/
 * 
 * Nota: As receitas não têm paginação, retornam todas de uma vez
 * 
 * @param empresaId - ID da empresa (opcional, se não informado retorna todas)
 * @param opts - Opções adicionais (search, ativo, debounceMs, enabled)
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useListarReceitas(empresaId, { search: "pizza", ativo: true });
 * ```
 */
export function useListarReceitas(
  empresaId?: number,
  opts: UseListarReceitasOptions = {}
) {
  const {
    search = "",
    ativo,
    debounceMs = 350,
    enabled = true,
  } = opts;

  const searchDeb = useDebounced(search, debounceMs);

  return useQuery<{ receitas: ReceitaListItem[] }>({
    queryKey: ["receitas_listar", empresaId, searchDeb, ativo],
    queryFn: async () => {
      const params: Record<string, any> = {};
      
      if (empresaId) {
        params.empresa_id = empresaId;
      }
      
      if (ativo !== undefined) {
        params.ativo = ativo;
      }
      
      if (searchDeb?.trim()) {
        params.search = searchDeb.trim();
      }

      try {
        const { data } = await apiAdmin.get<ReceitaApiResponse[]>("/api/catalogo/admin/receitas/", { params });

        // Mapear a resposta da API para o formato esperado
        const receitas: ReceitaListItem[] = (data || []).map((item) => ({
          id: item.id,
          receita_id: item.id,
          descricao: item.descricao || item.nome,
          nome: item.nome,
          preco_venda: parseFloat(item.preco_venda) || 0,
          imagem: item.imagem,
          ativo: item.ativo,
          empresa_id: item.empresa_id,
          disponivel: item.disponivel,
        }));

        return { receitas };
      } catch (error: any) {
        console.warn("Endpoint de receitas não encontrado", error);
        return { receitas: [] };
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
  });
}

