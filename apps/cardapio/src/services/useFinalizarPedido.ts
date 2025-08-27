"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTelefoneCliente,
  getEnderecoPadraoId,
} from "@cardapio/stores/client/ClientStore";
import { api } from "@cardapio/app/api/api";
import { FinalizarPedidoRequest } from "@cardapio/types/pedido";

interface UseFinalizarPedidoResult {
  loading: boolean;
  finalizarPedido: () => Promise<void>;
}

export function useFinalizarPedido(): UseFinalizarPedidoResult {
  const { items, observacao, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function finalizarPedido(): Promise<void> {
    if (items.length === 0) {
      toast.warning("Carrinho vazio.");
      return;
    }

    const empresa_id = getEmpresaId();
    const telefone_cliente = getTelefoneCliente();
    const endereco_id = getEnderecoPadraoId();

    if (!empresa_id || !telefone_cliente || !endereco_id) {
      toast.error("Informações do cliente incompletas.");
      return;
    }

    const payload: FinalizarPedidoRequest = {
      telefone_cliente,
      empresa_id,
      endereco_id,
      observacao_geral: observacao,
      itens: items.map((i) => ({
        produto_cod_barras: i.cod_barras,
        quantidade: i.quantity,
        observacao: i.observacao,
      })),
    };

    try {
      setLoading(true);
      await api.post("/delivery/pedidos/checkout", payload);
      toast.success("Pedido finalizado!");
      clear();
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || err.message || "Erro ao finalizar pedido.");
    } finally {
      setLoading(false);
    }
  }

  return { loading, finalizarPedido };
}
