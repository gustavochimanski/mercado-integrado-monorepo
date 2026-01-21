// @cardapio/services/complementos/buscar-complementos-unificado-client.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { ComplementoResponse, TipoProdutoEnum, TipoPedidoEnum } from "@cardapio/types/complementos";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL não configurado");
}

function normalizeComplementosPayload(payload: unknown): ComplementoResponse[] {
  if (Array.isArray(payload)) return payload as ComplementoResponse[];

  if (payload && typeof payload === "object") {
    const anyPayload = payload as any;
    if (Array.isArray(anyPayload.complementos)) return anyPayload.complementos as ComplementoResponse[];
    if (Array.isArray(anyPayload.data)) return anyPayload.data as ComplementoResponse[];
    if (Array.isArray(anyPayload.items)) return anyPayload.items as ComplementoResponse[];
  }

  return [];
}

async function fetchComplementosUnificadoOrFallback(params: {
  tipo: TipoProdutoEnum;
  identificador: string | number;
  tipoPedido: TipoPedidoEnum;
  apenasAtivos: boolean;
}): Promise<ComplementoResponse[]> {
  const identificadorStr = String(params.identificador);

  // 1) Tentativa: endpoint unificado (params conforme esperado)
  try {
    const response = await axios.get(
      `${BASE_URL}/api/catalogo/public/complementos`,
      {
        params: {
          tipo: params.tipo,
          identificador: identificadorStr,
          tipo_pedido: params.tipoPedido,
          apenas_ativos: params.apenasAtivos,
        },
      }
    );
    return normalizeComplementosPayload(response.data);
  } catch (err: any) {
    const status = err?.response?.status;

    // 2) Tentativa: alguns backends usam nomes alternativos de parâmetro
    if (status === 400 || status === 404 || status === 405 || status === 422) {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/catalogo/public/complementos`,
          {
            params: {
              tipo_produto: params.tipo,
              identificador: identificadorStr,
              tipo_pedido: params.tipoPedido,
              apenas_ativos: params.apenasAtivos,
            },
          }
        );
        return normalizeComplementosPayload(response.data);
      } catch {
        // segue fallback legado
      }
    }

    // 3) Fallback: endpoints legados (caso o unificado não exista no backend atual)
    const legacyPath =
      params.tipo === "produto"
        ? `/api/catalogo/public/complementos/produto/${encodeURIComponent(identificadorStr)}`
        : params.tipo === "combo"
          ? `/api/catalogo/public/complementos/combo/${encodeURIComponent(identificadorStr)}`
          : `/api/catalogo/public/complementos/receita/${encodeURIComponent(identificadorStr)}`;

    const legacyResponse = await axios.get(
      `${BASE_URL}${legacyPath}`,
      {
        params: {
          // se o backend ignorar, ok; se aceitar, melhor ainda
          tipo_pedido: params.tipoPedido,
          apenas_ativos: params.apenasAtivos,
        },
      }
    );

    return normalizeComplementosPayload(legacyResponse.data);
  }
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
 * IMPORTANTE: **TODOS** os valores de configuração (`obrigatorio`, `quantitativo`, `minimo_itens`, 
 * `maximo_itens` e `ordem`) retornados vêm da **vinculação** entre complemento e produto/receita/combo, 
 * não do complemento em si. Isso permite que o mesmo complemento tenha comportamentos diferentes 
 * dependendo de onde está sendo usado.
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

      return await fetchComplementosUnificadoOrFallback({
        tipo,
        identificador,
        tipoPedido,
        apenasAtivos,
      });
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
 * IMPORTANTE: **TODOS** os valores de configuração (`obrigatorio`, `quantitativo`, `minimo_itens`, 
 * `maximo_itens` e `ordem`) retornados vêm da **vinculação** entre complemento e produto/receita/combo, 
 * não do complemento em si.
 * 
 * @param tipo - Tipo do produto: "produto", "combo" ou "receita"
 * @param identificador - Código de barras (para produto) ou ID numérico (para combo/receita)
 * @param tipoPedido - Tipo de pedido: "balcao", "mesa" ou "delivery" (obrigatório)
 * @param apenasAtivos - Se true, retorna apenas complementos ativos (default: true)
 * 
 * @returns Promise com array de complementos (com valores da vinculação)
 */
export async function buscarComplementosUnificado(
  tipo: TipoProdutoEnum,
  identificador: string | number,
  tipoPedido: TipoPedidoEnum,
  apenasAtivos: boolean = true
): Promise<ComplementoResponse[]> {
  return await fetchComplementosUnificadoOrFallback({
    tipo,
    identificador,
    tipoPedido,
    apenasAtivos,
  });
}
