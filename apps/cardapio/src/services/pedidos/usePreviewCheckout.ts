import { useQuery } from "@tanstack/react-query";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { getCliente, getTokenCliente } from "@cardapio/stores/client/ClientStore";
import { previewCheckoutCliente } from "@cardapio/services/pedidos/checkout-finalizar-pedido";
import type { FinalizarPedidoRequest, TipoPedidoCheckout } from "@cardapio/types/pedido";
import { mapCartToPedidoItems } from "@cardapio/stores/cart/mapCartToPedidoItems";

export interface PreviewCheckoutResult {
  subtotal: number;
  taxa_entrega: number;
  taxa_servico: number;
  valor_total: number;
  desconto: number;
  distancia_km?: number;
  empresa_id?: number;
  tempo_entrega_minutos?: number;
}

/**
 * Hook para calcular preview do checkout (taxa de entrega, subtotal, etc.)
 * 
 * Usa a API unificada de Pedidos: POST /api/pedidos/client/checkout/preview
 * 
 * Calcula valores do pedido sem criar o pedido no banco de dados.
 * Retorna subtotal, taxas, desconto e total calculados.
 * 
 * Autenticação: Requer X-Super-Token no header (token do cliente)
 * 
 */
interface UsePreviewCheckoutParams {
  tipoPedido: TipoPedidoCheckout | null;
  enderecoId?: number | null;
  meioPagamentoId?: number | null;
  mesaCodigo?: string | null;
  numPessoas?: number | null;
  trocoPara?: number | null;
  empresaSelecionadaId?: number | null;
  enabled?: boolean;
}

export function usePreviewCheckout({
  tipoPedido,
  enderecoId = null,
  meioPagamentoId = null,
  mesaCodigo = null,
  numPessoas = null,
  trocoPara = null,
  empresaSelecionadaId = null,
  enabled = true,
}: UsePreviewCheckoutParams) {
  const { items, combos, receitas, observacao } = useCart();
  
  const empresaStoreId = getEmpresaId();
  const telefone_cliente = getTokenCliente();
  const cliente = getCliente();
  
  const empresaIdParaUso =
    tipoPedido === "BALCAO"
      ? empresaSelecionadaId ?? null
      : empresaStoreId || null;

  return useQuery<PreviewCheckoutResult | null>({
    queryKey: [
      "preview-checkout",
      tipoPedido,
      items.map(i => `${i.cod_barras}-${i.quantity}-${(i.adicionais?.map(a => a.id).sort().join(",") || "")}`).join(","),
      combos?.map(c => `${c.combo_id}-${c.quantidade}-${(c.adicionais?.map(a => a.id).sort().join(",") || "")}`).join(",") || "",
      receitas?.map(r => `${r.receita_id}-${r.quantidade}-${(r.adicionais?.map(a => a.id).sort().join(",") || "")}`).join(",") || "",
      enderecoId,
      meioPagamentoId,
      mesaCodigo,
      numPessoas,
      trocoPara,
      empresaSelecionadaId,
      empresaStoreId,
      observacao,
    ],
    queryFn: async () => {
      if (!tipoPedido || (!items.length && (!combos || combos.length === 0) && (!receitas || receitas.length === 0)) || !telefone_cliente) {
        return null;
      }

      if (tipoPedido === "DELIVERY") {
        if (!enderecoId || !meioPagamentoId) {
          return null;
        }
      }

      if (tipoPedido === "MESA" && !mesaCodigo) {
        return null;
      }

      if (tipoPedido !== "DELIVERY" && !empresaIdParaUso) {
        return null;
      }

      try {
        // Converter itens do carrinho para formato aninhado em produtos
        const { produtos } = 
          mapCartToPedidoItems(items, combos || [], receitas || []);

        const payload: FinalizarPedidoRequest = {
          tipo_pedido: tipoPedido,
          origem: "WEB",
          observacao_geral: observacao || undefined,
          produtos,
          cliente_id: cliente?.id ? Number(cliente.id) : null,
        };

        // Para DELIVERY, empresa_id deve ser null (não undefined)
        if (tipoPedido === "DELIVERY") {
          payload.empresa_id = null;
          payload.tipo_entrega = "DELIVERY";
          payload.endereco_id = enderecoId ?? null;
          payload.troco_para = trocoPara ?? null;
          
          // Usar meios_pagamento ao invés de meio_pagamento_id na raiz
          if (meioPagamentoId) {
            // TODO: Calcular o valor total do pedido para meios_pagamento
            // Por enquanto, vamos usar um valor placeholder que será ajustado pelo backend
            payload.meios_pagamento = [
              {
                meio_pagamento_id: meioPagamentoId,
                valor: 0, // O backend deve calcular o valor correto no preview
              },
            ];
          }
        } else {
          // Para MESA e BALCAO, incluir empresa_id
          payload.empresa_id = empresaIdParaUso ?? undefined;
          payload.mesa_codigo = mesaCodigo ?? undefined;
          if (tipoPedido === "MESA" && numPessoas) {
            payload.num_pessoas = numPessoas;
          }
        }

        const result = await previewCheckoutCliente(payload);

        return result;
      } catch (error: any) {
        // Se der erro 400 (área de atendimento), retorna null
        if (error.response?.status === 400) {
          console.warn("Endereço fora da área de atendimento");
          return null;
        }
        console.error("Erro ao calcular preview do checkout:", error);
        return null;
      }
    },
    enabled:
      enabled &&
      !!tipoPedido &&
      (tipoPedido === "DELIVERY" || !!empresaIdParaUso) &&
      (items.length > 0 || (combos && combos.length > 0) || (receitas && receitas.length > 0)),
    staleTime: 10000, // Cache por 10 segundos
    refetchOnWindowFocus: false,
  });
}
