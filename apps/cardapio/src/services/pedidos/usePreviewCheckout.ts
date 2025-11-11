import { useQuery } from "@tanstack/react-query";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { getCliente, getTokenCliente } from "@cardapio/stores/client/ClientStore";
import { previewCheckoutCliente } from "@cardapio/services/pedidos/checkout-finalizar-pedido";
import type { FinalizarPedidoRequest, TipoPedidoCheckout } from "@cardapio/types/pedido";

export interface PreviewCheckoutResult {
  subtotal: number;
  taxa_entrega: number;
  taxa_servico: number;
  valor_total: number;
  desconto: number;
}

/**
 * Hook para calcular preview do checkout (taxa de entrega, subtotal, etc.)
 * 
 * Usa a API de pedidos do cliente: POST /api/cardapio/client/pedidos/checkout/preview
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
  const { items, observacao } = useCart();
  
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
      items.map(i => `${i.cod_barras}-${i.quantity}`).join(","),
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
      if (!tipoPedido || items.length === 0 || !telefone_cliente) {
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
        const payload: FinalizarPedidoRequest = {
          tipo_pedido: tipoPedido,
          origem: "WEB",
          observacao_geral: observacao || undefined,
          itens: items.map((i) => ({
            produto_cod_barras: i.cod_barras,
            quantidade: i.quantity,
            observacao: i.observacao || undefined,
          })),
          cliente_id: cliente?.id ? Number(cliente.id) : null,
        };

        if (tipoPedido !== "DELIVERY") {
          payload.empresa_id = empresaIdParaUso ?? undefined;
        }

        if (tipoPedido === "DELIVERY") {
          payload.endereco_id = enderecoId ?? undefined;
          payload.meio_pagamento_id = meioPagamentoId ?? undefined;
          payload.troco_para = trocoPara ?? undefined;
        } else {
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
      items.length > 0,
    staleTime: 10000, // Cache por 10 segundos
    refetchOnWindowFocus: false,
  });
}
