// @cardapio/services/adicionais/buscar-adicionais-combo-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { AdicionalResponse } from "@cardapio/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar adicionais de um combo (client-side)
 * Endpoint: GET /api/catalogo/client/adicionais/combo/{combo_id}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
 * Retorna apenas adicionais ativos por padrão (a menos que apenas_ativos=false).
 * 
 * Regra de negócio: Carrega o combo e para cada produto do combo, busca os adicionais
 * vinculados a esse produto. Faz o union (sem duplicar IDs) e devolve uma lista de AdicionalResponse.
 * 
 * @param comboId - ID do combo
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: adicionais, isLoading } = useBuscarAdicionaisComboClient(10);
 * ```
 */
export function useBuscarAdicionaisComboClient(
  comboId: number | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<AdicionalResponse[]>({
    queryKey: ["adicionais-combo", comboId, apenasAtivos],
    queryFn: async () => {
      if (!comboId || !tokenCliente) {
        throw new Error("ID do combo ou token do cliente não fornecido");
      }

      const response = await axios.get<AdicionalResponse[]>(
        `${BASE_URL}/api/catalogo/client/adicionais/combo/${comboId}`,
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
    enabled: enabled && !!comboId && !!tokenCliente,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca adicionais de um combo de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param comboId - ID do combo
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * 
 * @returns Promise com array de adicionais
 */
export async function buscarAdicionaisCombo(
  comboId: number,
  apenasAtivos: boolean = true
): Promise<AdicionalResponse[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const response = await axios.get<AdicionalResponse[]>(
    `${BASE_URL}/api/catalogo/client/adicionais/combo/${comboId}`,
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

