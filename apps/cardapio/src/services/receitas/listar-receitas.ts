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
  page?: number;
  limit?: number;
  q?: string; // Termo de busca opcional
  debounceMs?: number;
  enabled?: boolean;
}

/**
 * Hook para listar receitas com paginação e busca opcional
 * Endpoint: GET /api/catalogo/admin/receitas/
 * 
 * @param empresaId - ID da empresa (obrigatório)
 * @param opts - Opções adicionais (page, limit, q, debounceMs, enabled)
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useListarReceitas(empresaId, { page: 1, limit: 30, q: "pizza" });
 * ```
 */
export function useListarReceitas(
  empresaId: number,
  opts: UseListarReceitasOptions = {}
) {
  const {
    page = 1,
    limit = 30,
    q = "",
    debounceMs = 350,
    enabled = true,
  } = opts;

  const buscaDeb = useDebounced(q, debounceMs);

  return useQuery<{ receitas: ReceitaListItem[]; hasMore: boolean }>({
    queryKey: ["receitas_listar", empresaId, page, limit, buscaDeb],
    queryFn: async () => {
      const params: Record<string, any> = {
        cod_empresa: empresaId,
        page,
        limit,
      };
      if (buscaDeb?.trim()) {
        params.q = buscaDeb.trim();
      }

      try {
        const { data } = await apiAdmin.get<ReceitaApiResponse[]>("/api/catalogo/admin/receitas/", { params });

        // Mapear a resposta da API para o formato esperado
        let receitas: ReceitaListItem[] = (data || []).map((item) => ({
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

        // Filtrar por busca se necessário (client-side por enquanto)
        if (buscaDeb?.trim()) {
          receitas = receitas.filter((r) =>
            r.descricao.toLowerCase().includes(buscaDeb.toLowerCase()) ||
            r.nome.toLowerCase().includes(buscaDeb.toLowerCase())
          );
        }

        // Como o endpoint retorna array direto, assumimos que há mais se retornou o limite completo
        const hasMore = receitas.length === limit;

        return { receitas, hasMore };
      } catch (error: any) {
        console.warn("Endpoint de receitas não encontrado", error);
        return { receitas: [], hasMore: false };
      }
    },
    enabled: enabled && !!empresaId,
    staleTime: 5 * 60 * 1000,
  });
}

