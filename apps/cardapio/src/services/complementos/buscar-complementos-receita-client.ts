// @cardapio/services/complementos/buscar-complementos-receita-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { ComplementoResponse } from "./buscar-complementos-produto-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar complementos de uma receita (client-side)
 * Endpoint: GET /api/catalogo/client/complementos/receita/{receita_id}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
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
  const tokenCliente = getTokenCliente();

  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-receita", receitaId, apenasAtivos],
    queryFn: async () => {
      if (!receitaId || !tokenCliente) {
        throw new Error("ID da receita ou token do cliente não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/client/complementos/receita/${receitaId}`,
        {
          headers: {
            "X-Super-Token": tokenCliente,
          },
          params: {
            apenas_ativos: apenasAtivos,
          },
        }
      );

      return response.data;
    },
    enabled: enabled && !!receitaId && !!tokenCliente,
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
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/client/complementos/receita/${receitaId}`,
    {
      headers: {
        "X-Super-Token": tokenCliente,
      },
      params: {
        apenas_ativos: apenasAtivos,
      },
    }
  );

  return response.data;
}

