// @cardapio/services/complementos/buscar-complementos-combo-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ComplementoResponse } from "@cardapio/types/complementos";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

/**
 * Hook para buscar complementos de um combo (client-side)
 * Endpoint: GET /api/catalogo/public/complementos/combo/{combo_id}
 * 
 * Endpoint público - não requer autenticação.
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
  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-combo", comboId, apenasAtivos],
    queryFn: async () => {
      if (!comboId) {
        throw new Error("ID do combo não fornecido");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/public/complementos/combo/${comboId}`,
        {
          params: {
            apenas_ativos: apenasAtivos,
          },
        }
      );

      return response.data;
    },
    enabled: enabled && !!comboId && typeof window !== 'undefined',
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
  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/public/complementos/combo/${comboId}`,
    {
      params: {
        apenas_ativos: apenasAtivos,
      },
    }
  );

  return response.data;
}

