"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import {
  getCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";

import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";
import EnderecoModal from "@cardapio/components/Shared/finalizar-pedido/EnderecoModal";
import MeioPagamentoModal from "@cardapio/components/Shared/finalizar-pedido/MeioPagamentoModal";
import { useFinalizarPedido } from "@cardapio/services/useFinalizarPedido";
import { Button } from "@cardapio/components/Shared/ui/button";

export default function FinalizarPedidoPage() {
  const { items, totalPrice, clear } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();
  const router = useRouter();

  const [loaded, setLoaded] = useState(false); // garante que cliente do storage foi carregado
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);

  // Carrega cliente do store e define modais iniciais
  useEffect(() => {
    const cliente = getCliente();
    const enderecoId = getEnderecoPadraoId();
    const meioPagamentoId = getMeioPagamentoId();

    setShowClienteModal(!cliente.telefone);
    setShowEnderecoModal(!!cliente.telefone && !enderecoId);
    setShowPagamentoModal(!!cliente.telefone && !!enderecoId && !meioPagamentoId);

    setLoaded(true);
  }, []);

  const proximoModal = () => {
    const cliente = getCliente();
    const enderecoId = getEnderecoPadraoId();
    const meioPagamentoId = getMeioPagamentoId();

    if (!cliente.telefone) setShowClienteModal(true);
    else if (!enderecoId) setShowEnderecoModal(true);
    else if (!meioPagamentoId) setShowPagamentoModal(true);
    else handleFinalizar();
  };

  const handleFinalizar = async () => {
    if (items.length === 0) return;
    try {
      await finalizarPedido();
      clear();
      router.push("/pedido-confirmado");
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
    }
  };

  if (!loaded) return null; // evita render antes de carregar o store

  return (
    <>
      <ClienteIdentificacaoModal
        open={!!showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onConfirm={() => {
          setShowClienteModal(false);
          proximoModal();
        }}
      />

      <EnderecoModal
        open={!!showEnderecoModal}
        onClose={() => setShowEnderecoModal(false)}
        onConfirm={() => {
          setShowEnderecoModal(false);
          proximoModal();
        }}
      />

      <MeioPagamentoModal
        open={!!showPagamentoModal}
        onClose={() => setShowPagamentoModal(false)}
        onConfirm={() => {
          setShowPagamentoModal(false);
          proximoModal();
        }}
      />

      {/* Resumo do pedido */}
      <div className="max-w-lg mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
        <p>Itens no carrinho: {items.length}</p>
        <p>Total: R$ {totalPrice().toFixed(2)}</p>

        <Button onClick={handleFinalizar} disabled={loading}>
          {loading ? "Enviando..." : "Finalizar Pedido"}
        </Button>
      </div>
    </>
  );
}
