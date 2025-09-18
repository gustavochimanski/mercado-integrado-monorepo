import { useState } from "react";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTokenCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";
import { FinalizarPedidoRequest } from "@cardapio/types/pedido";
import { apiClienteAdmin } from "@cardapio/app/api/apiClienteAdmin";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: () => Promise<"sucesso" | { status: "erro"; message: string }>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido(): Promise<"sucesso" | { status: "erro"; message: string }> {
    setLoading(true);

    try {
      if (items.length === 0) {
        return { status: "erro", message: "Carrinho vazio. Adicione itens antes de finalizar o pedido." };
      }

      const empresa_id = getEmpresaId();
      const telefone_cliente = getTokenCliente();
      const endereco_id = getEnderecoPadraoId();
      const meio_pagamento_id = getMeioPagamentoId();

      if (!empresa_id) {
        return { status: "erro", message: "Empresa não encontrada. Recarregue a página e tente novamente." };
      }
      if (!telefone_cliente) {
        return { status: "erro", message: "Cliente não identificado. Faça login novamente." };
      }
      if (!endereco_id) {
        return { status: "erro", message: "Endereço não selecionado. Selecione um endereço de entrega." };
      }
      if (!meio_pagamento_id) {
        return { status: "erro", message: "Forma de pagamento não selecionada. Escolha uma forma de pagamento." };
      }

      const payload: FinalizarPedidoRequest = {
        telefone_cliente,
        empresa_id,
        endereco_id,
        meio_pagamento_id,
        tipo_entrega: "DELIVERY",
        origem: "WEB",
        observacao_geral: observacao || undefined,
        itens: items.map((i) => ({
          produto_cod_barras: i.cod_barras,
          quantidade: i.quantity,
          observacao: i.observacao,
        })),
      };

      const response = await apiClienteAdmin.post("/delivery/pedidos/checkout", payload);

      if (response.status === 200 || response.status === 201) {
        clear();
        return "sucesso";
      }
      
      return { status: "erro", message: "Erro interno do servidor. Tente novamente em alguns minutos." };
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      
      // Usa a função extractErrorMessage para extrair a mensagem de erro
      const errorMessage = extractErrorMessage(error, "Erro inesperado ao finalizar pedido");
      
      return { status: "erro", message: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  return { loading, finalizarPedido };
}
