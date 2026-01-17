// @cardapio/services/complementos/buscar-complementos-unificado-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ComplementoResponse, TipoProdutoEnum, TipoPedidoEnum } from "@cardapio/types/complementos";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

// Re-exportar tipos centralizados para manter compatibilidade
export type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";
export type { TipoProdutoEnum, TipoPedidoEnum } from "@cardapio/types/complementos";

/**
 * Hook para buscar complementos usando o endpoint unificado (client-side)
 * Endpoint: GET /api/catalogo/public/complementos
 * 
 * Este endpoint substitui os endpoints antigos:
 * - GET /api/catalogo/public/complementos/produto/{cod_barras}
 * - GET /api/catalogo/public/complementos/combo/{combo_id}
 * - GET /api/catalogo/public/complementos/receita/{receita_id}
 * 
 * Endpoint público - não requer autenticação.
 * Retorna apenas complementos ativos por padrão (a menos que apenas_ativos=false).
 * 
 * @param tipo - Tipo do produto: "produto", "combo" ou "receita"
 * @param identificador - Código de barras (para produto) ou ID numérico (para combo/receita)
 * @param tipoPedido - Tipo de pedido: "balcao", "mesa" ou "delivery" (obrigatório)
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * @param enabled - Se false, a query não será executada (default: true)
 * 
 * @example
 * ```tsx
 * // Produto
 * const { data: complementos } = useBuscarComplementosUnificado(
 *   "produto",
 *   "7891234567890",
 *   "delivery"
 * );
 * 
 * // Combo
 * const { data: complementos } = useBuscarComplementosUnificado(
 *   "combo",
 *   "5",
 *   "mesa"
 * );
 * 
 * // Receita
 * const { data: complementos } = useBuscarComplementosUnificado(
 *   "receita",
 *   "10",
 *   "balcao"
 * );
 * ```
 */
export function useBuscarComplementosUnificado(
  tipo: TipoProdutoEnum | null | undefined,
  identificador: string | number | null | undefined,
  tipoPedido: TipoPedidoEnum,
  apenasAtivos: boolean = true,
  enabled: boolean = true
) {
  return useQuery<ComplementoResponse[]>({
    queryKey: ["complementos-unificado", tipo, identificador, tipoPedido, apenasAtivos],
    queryFn: async () => {
      if (!tipo || !identificador) {
        throw new Error("Tipo e identificador são obrigatórios");
      }

      const response = await axios.get<ComplementoResponse[]>(
        `${BASE_URL}/api/catalogo/public/complementos`,
        {
          params: {
            tipo,
            identificador: String(identificador),
            tipo_pedido: tipoPedido,
            apenas_ativos: apenasAtivos,
          },
        }
      );

      return response.data;
    },
    // Habilitar apenas quando enabled=true, parâmetros existem, e estamos no cliente
    enabled: enabled && !!tipo && !!identificador && !!tipoPedido && typeof window !== 'undefined',
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    refetchOnWindowFocus: false,
  });
}

/**
 * Busca complementos usando o endpoint unificado de forma síncrona (sem hook).
 * Útil para uso em funções que não são componentes React.
 * 
 * @param tipo - Tipo do produto: "produto", "combo" ou "receita"
 * @param identificador - Código de barras (para produto) ou ID numérico (para combo/receita)
 * @param tipoPedido - Tipo de pedido: "balcao", "mesa" ou "delivery" (obrigatório)
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * 
 * @returns Promise com array de complementos
 */
export async function buscarComplementosUnificado(
  tipo: TipoProdutoEnum,
  identificador: string | number,
  tipoPedido: TipoPedidoEnum,
  apenasAtivos: boolean = true
): Promise<ComplementoResponse[]> {
  const response = await axios.get<ComplementoResponse[]>(
    `${BASE_URL}/api/catalogo/public/complementos`,
    {
      params: {
        tipo,
        identificador: String(identificador),
        tipo_pedido: tipoPedido,
        apenas_ativos: apenasAtivos,
      },
    }
  );

  return response.data;
}
