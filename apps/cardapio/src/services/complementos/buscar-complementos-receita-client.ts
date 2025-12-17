// @cardapio/services/complementos/buscar-complementos-receita-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ComplementoResponse } from "@cardapio/types/complementos";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar complementos de uma receita (client-side)
 * Endpoint: GET /api/catalogo/public/complementos/receita/{receita_id}
 * 
 * Endpoint público - não requer autenticação.
 * Retorna apenas complementos ativos por padrão (a menos que apenas_ativos=false).
 * 
 * @param receitaId - ID da receita
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: complementos, isLoading } = useBuscarComplementosReceitaClient(5);
 * ```
 */
export function useBuscarComplementosReceitaClient(
  receitaId: number | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-receita", receitaId, apenasAtivos],
    queryFn: async () => {
      if (!receitaId) {
        throw new Error("ID da receita não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/public/complementos/receita/${receitaId}`,
        {
          params: {
            apenas_ativos: apenasAtivos,
          },
        }
      );

      return response.data;
    },
    enabled: enabled && !!receitaId && typeof window !== 'undefined',
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca complementos de uma receita de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param receitaId - ID da receita
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * 
 * @returns Promise com array de complementos
 */
export async function buscarComplementosReceita(
  receitaId: number,
  apenasAtivos: boolean = true
): Promise<ComplementoResponse[]> {
  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/public/complementos/receita/${receitaId}`,
    {
      params: {
        apenas_ativos: apenasAtivos,
      },
    }
  );

  return response.data;
}

