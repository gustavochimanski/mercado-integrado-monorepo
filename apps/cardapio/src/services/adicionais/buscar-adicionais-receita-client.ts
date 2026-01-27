// @cardapio/services/adicionais/buscar-adicionais-receita-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import { getApiBaseUrlClient } from "@cardapio/lib/api/getApiBaseUrl.client";
import type { AdicionalResponse } from "@cardapio/api";

/**
 * Hook para buscar adicionais de uma receita (client-side)
 * Endpoint: GET /api/catalogo/client/adicionais/receita/{receita_id}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
 * Retorna apenas adicionais ativos por padrão (a menos que apenas_ativos=false).
 * 
 * Regra de negócio: Carrega a receita e usa os vínculos ReceitaAdicionalModel
 * (receita.adicionais) para chegar nos AdicionalModel. Filtra por ativo se apenas_ativos=true.
 * 
 * @param receitaId - ID da receita
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: adicionais, isLoading } = useBuscarAdicionaisReceitaClient(5);
 * ```
 */
export function useBuscarAdicionaisReceitaClient(
  receitaId: number | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<AdicionalResponse[]>({
    queryKey: ["adicionais-receita", receitaId, apenasAtivos],
    queryFn: async () => {
      if (!receitaId || !tokenCliente) {
        throw new Error("ID da receita ou token do cliente não fornecido");
      }

      const baseUrl = getApiBaseUrlClient();
      const response = await axios.get<AdicionalResponse[]>(
        `${baseUrl}/api/catalogo/client/adicionais/receita/${receitaId}`,
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
 * Busca adicionais de uma receita de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param receitaId - ID da receita
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * 
 * @returns Promise com array de adicionais
 */
export async function buscarAdicionaisReceita(
  receitaId: number,
  apenasAtivos: boolean = true
): Promise<AdicionalResponse[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const baseUrl = getApiBaseUrlClient();
  const response = await axios.get<AdicionalResponse[]>(
    `${baseUrl}/api/catalogo/client/adicionais/receita/${receitaId}`,
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

