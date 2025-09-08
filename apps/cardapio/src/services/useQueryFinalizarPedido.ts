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

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: () => Promise<"sucesso" | "erro">;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido(): Promise<"sucesso" | "erro"> {
    setLoading(true);

    try {
      if (items.length === 0) return "erro";

      const empresa_id = getEmpresaId();
      const telefone_cliente = getTokenCliente();
      const endereco_id = getEnderecoPadraoId();
      const meio_pagamento_id = getMeioPagamentoId();

      if (!empresa_id || !telefone_cliente || !endereco_id || !meio_pagamento_id) return "erro";

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
      return "erro";
    } catch {
      return "erro";
    } finally {
      setLoading(false);
    }
  }

  return { loading, finalizarPedido };
}
