// @cardapio/services/complementos/buscar-complementos-combo-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { ComplementoResponse } from "./buscar-complementos-produto-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar complementos de um combo (client-side)
 * Endpoint: GET /api/catalogo/client/complementos/combo/{combo_id}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
 * Retorna apenas complementos ativos por padrão (a menos que apenas_ativos=false).
 * 
 * @param comboId - ID do combo
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: complementos, isLoading } = useBuscarComplementosComboClient(10);
 * ```
 */
export function useBuscarComplementosComboClient(
  comboId: number | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-combo", comboId, apenasAtivos],
    queryFn: async () => {
      if (!comboId || !tokenCliente) {
        throw new Error("ID do combo ou token do cliente não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/client/complementos/combo/${comboId}`,
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
 * Busca complementos de um combo de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param comboId - ID do combo
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * 
 * @returns Promise com array de complementos
 */
export async function buscarComplementosCombo(
  comboId: number,
  apenasAtivos: boolean = true
): Promise<ComplementoResponse[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/client/complementos/combo/${comboId}`,
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

