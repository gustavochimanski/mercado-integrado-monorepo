// @cardapio/services/receitas/buscar-receita.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { ReceitaApiResponse, ReceitaListItem } from "./types";

interface UseBuscarReceitaOptions {
  enabled?: boolean;
}

/**
 * Hook para buscar uma receita específica por ID
 * Endpoint: GET /api/catalogo/admin/receitas/{receitaId}
 * 
 * @param receitaId - ID da receita (obrigatório)
 * @param opts - Opções adicionais (enabled)
 * 
 * @example
 * ```tsx
 * const { data: receita, isLoading } = useBuscarReceita(123);
 * ```
 */
export function useBuscarReceita(
  receitaId: number | null,
  opts: UseBuscarReceitaOptions = {}
) {
  const { enabled = true } = opts;

  return useQuery<ReceitaListItem>({
    queryKey: ["receita", receitaId],
    queryFn: async () => {
      const { data } = await apiAdmin.get<ReceitaApiResponse>(
        `/api/catalogo/admin/receitas/${receitaId}`
      );
      
      // Mapear a resposta da API para o formato esperado
      return {
        id: data.id,
        receita_id: data.id,
        descricao: data.descricao || data.nome,
        nome: data.nome,
        preco_venda: parseFloat(data.preco_venda) || 0,
        imagem: data.imagem,
        ativo: data.ativo,
        empresa_id: data.empresa_id,
        disponivel: data.disponivel,
      };
    },
    enabled: enabled && !!receitaId,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

