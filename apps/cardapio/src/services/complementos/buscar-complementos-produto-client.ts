// @cardapio/services/complementos/buscar-complementos-produto-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getTokenCliente } from "@cardapio/stores/client/ClientStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Interface para um Adicional (Item) dentro de um Complemento
 * Corresponde ao AdicionalResponse da API
 */
export interface AdicionalComplemento {
  id: number;                      // Este é o adicional_id usado nos pedidos
  nome: string;
  descricao?: string | null;
  preco: number;
  custo: number;
  ativo: boolean;
  ordem: number;
  created_at: string;              // ISO 8601
  updated_at: string;              // ISO 8601
}

/**
 * Interface para um Complemento
 * Corresponde ao ComplementoResponse da API
 */
export interface ComplementoResponse {
  id: number;
  empresa_id: number;
  nome: string;
  descricao?: string | null;
  obrigatorio: boolean;
  quantitativo: boolean;
  permite_multipla_escolha: boolean;
  ordem: number;
  ativo: boolean;
  adicionais: AdicionalComplemento[];
  created_at: string;              // ISO 8601
  updated_at: string;              // ISO 8601
}

/**
 * Hook para buscar complementos de um produto (client-side)
 * Endpoint: GET /api/catalogo/client/complementos/produto/{cod_barras}
 * 
 * Requer autenticação via header X-Super-Token (token do cliente).
 * Retorna apenas complementos ativos por padrão (a menos que apenas_ativos=false).
 * 
 * @param codBarras - Código de barras do produto
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * const { data: complementos, isLoading } = useBuscarComplementosProdutoClient("7891234567890");
 * ```
 */
export function useBuscarComplementosProdutoClient(
  codBarras: string | null | undefined,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  const tokenCliente = getTokenCliente();

  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-produto", codBarras, apenasAtivos],
    queryFn: async () => {
      if (!codBarras || !tokenCliente) {
        throw new Error("Código de barras ou token do cliente não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/client/complementos/produto/${codBarras}`,
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
 * Busca complementos de um produto de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param codBarras - Código de barras do produto
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * 
 * @returns Promise com array de complementos
 */
export async function buscarComplementosProduto(
  codBarras: string,
  apenasAtivos: boolean = true
): Promise<ComplementoResponse[]> {
  const tokenCliente = getTokenCliente();

  if (!tokenCliente) {
    throw new Error("Token do cliente não encontrado. Cliente não autenticado.");
  }

  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/client/complementos/produto/${codBarras}`,
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

