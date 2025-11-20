// @cardapio/services/adicionais/buscar-adicionais-produto-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";
import type { AdicionalResponse } from "@cardapio/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar adicionais de um produto (client-side)
 * Endpoint: GET /api/cadastros/client/adicionais/produto/{cod_barras}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
 * Retorna apenas adicionais ativos por padrão (a menos que apenas_ativos=false).
 * 
 * @param codBarras - Código de barras do produto
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: adicionais, isLoading } = useBuscarAdicionaisProdutoClient("7891000112233");
 * ```
 */
export function useBuscarAdicionaisProdutoClient(
  codBarras: string | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<AdicionalResponse[]>({
    queryKey: ["adicionais-produto", codBarras, apenasAtivos],
    queryFn: async () => {
      if (!codBarras || !tokenCliente) {
        throw new Error("Código de barras ou token do cliente não fornecido");
      }

      const response = await axios.get<AdicionalResponse[]>(
        `${BASE_URL}/api/cadastros/client/adicionais/produto/${codBarras}`,
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
    enabled: enabled && !!codBarras && !!tokenCliente,
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca adicionais de um produto de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param codBarras - Código de barras do produto
 * @param apenasAtivos - Se true, retorna apenas adicionais ativos (default: true)
 * 
 * @returns Promise com array de adicionais
 */
export async function buscarAdicionaisProduto(
  codBarras: string,
  apenasAtivos: boolean = true
): Promise<AdicionalResponse[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const response = await axios.get<AdicionalResponse[]>(
    `${BASE_URL}/api/cadastros/client/adicionais/produto/${codBarras}`,
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

