"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@cardapio/stores/cart/useCart";
import { FinalizarPedidoPayload } from "@cardapio/types/pedido";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import {
  getTelefoneCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";
import { api } from "@cardapio/app/api/api";

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

    const empresaId = getEmpresaId();
    const telefoneCliente = getTelefoneCliente();
    const enderecoEntregaId = getEnderecoPadraoId();
    const meioPagamentoId = getMeioPagamentoId();

    if (!empresaId || !telefoneCliente || !enderecoEntregaId) {
      toast.error("Informações do cliente incompletas.");
      return;
    }

    const payload: FinalizarPedidoPayload = {
      telefoneCliente,
      empresaId,
      enderecoEntregaId: String(enderecoEntregaId),
      meioPagamentoId: meioPagamentoId ? String(meioPagamentoId) : undefined,
      observacaoGeral: observacao,
      itens: items.map((i) => ({
        codigoProduto: i.cod_barras, // ⚡ agora bate com ItemPedido
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
