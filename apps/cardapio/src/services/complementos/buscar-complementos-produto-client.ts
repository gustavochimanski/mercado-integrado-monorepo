// @cardapio/services/complementos/buscar-complementos-produto-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ComplementoResponse } from "@cardapio/types/complementos";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

// Re-exportar tipos centralizados para manter compatibilidade
export type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";

/**
 * Hook para buscar complementos de um produto (client-side)
 * Endpoint: GET /api/catalogo/public/complementos/produto/{cod_barras}
 * 
 * Endpoint público - não requer autenticação.
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
  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-produto", codBarras, apenasAtivos],
    queryFn: async () => {
      if (!codBarras) {
        throw new Error("Código de barras não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/public/complementos/produto/${codBarras}`,
        {
          params: {
            apenas_ativos: apenasAtivos,
          },
        }
      );

      return response.data;
    },
    // Habilitar apenas quando enabled=true, codBarras existe, e estamos no cliente
    enabled: enabled && !!codBarras && typeof window !== 'undefined',
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
  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/public/complementos/produto/${codBarras}`,
    {
      params: {
        apenas_ativos: apenasAtivos,
      },
    }
  );

  return response.data;
}

