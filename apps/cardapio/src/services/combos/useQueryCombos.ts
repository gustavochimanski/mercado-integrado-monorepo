import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { ComboDTO } from "@cardapio/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Busca combos disponíveis para o cliente.
 * 
 * NOTA: Este endpoint ainda não existe no backend. Quando implementado,
 * será: GET /api/cadastros/client/combos
 * 
 * Por enquanto, retorna um array vazio. Quando o endpoint estiver disponível,
 * descomente o código abaixo e remova o retorno vazio.
 * 
 * @param empresaId - ID da empresa (opcional, para filtrar combos)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: combos, isLoading } = useCombosCliente(empresaId);
 * 
 * if (combos && combos.length > 0) {
 *   // Exibir combos disponíveis
 * }
 * ```
 */
export function useCombosCliente(
  empresaId?: number | null,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<ComboDTO[]>({
    queryKey: ["combos-cliente", empresaId],
    queryFn: async () => {
      if (!tokenCliente) {
        throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
      }

      // TODO: Quando o endpoint estiver disponível, descomente:
      /*
      const params: Record<string, any> = {};
      if (empresaId) {
        params.empresa_id = empresaId;
      }

      const response = await axios.get<ComboDTO[]>(
        `${BASE_URL}/api/cadastros/client/combos`,
        {
          headers: {
            "X-Super-Token": tokenCliente,
          },
          params,
        }
      );

      return response.data;
      */

      // Por enquanto, retorna array vazio
      return [];
    },
    enabled: enabled && !!tokenCliente,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca combos de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * NOTA: Este endpoint ainda não existe no backend.
 * 
 * @param empresaId - ID da empresa (opcional, para filtrar combos)
 * 
 * @returns Promise com array de combos
 */
export async function buscarCombosCliente(
  empresaId?: number | null
): Promise<ComboDTO[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  // TODO: Quando o endpoint estiver disponível, descomente:
  /*
  const params: Record<string, any> = {};
  if (empresaId) {
    params.empresa_id = empresaId;
  }

  const response = await axios.get<ComboDTO[]>(
    `${BASE_URL}/api/cadastros/client/combos`,
    {
      headers: {
        "X-Super-Token": tokenCliente,
      },
      params,
    }
  );

  return response.data;
  */

  // Por enquanto, retorna array vazio
  return [];
}

