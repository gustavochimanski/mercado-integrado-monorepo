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
import { Card, CardContent, CardFooter, CardHeader } from "@cardapio/components/Shared/ui/card";

export default function FinalizarPedidoPage() {
  const { items, totalPrice, clear, observacao } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);

  // Dados do cliente
  const cliente = getCliente();
  const enderecoId = getEnderecoPadraoId();
  const meioPagamentoId = getMeioPagamentoId();

  useEffect(() => {
    setShowClienteModal(!cliente.telefone);
    setShowEnderecoModal(!!cliente.telefone && !enderecoId);
    setShowPagamentoModal(!!cliente.telefone && !!enderecoId && !meioPagamentoId);
    setLoaded(true);
  }, []);

  const proximoModal = () => {
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
      console.error("Erro ao finalizar pedido");
    }
  };

  if (!loaded) return null;

  return (
    <>
      {/* ---- Modais ---- */}
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

      {/* ---- Resumo do Pedido ---- */}
      <div className="min-h-screen w-full flex flex-col gap-4 p-2">
        <Card className="p-2">
          <CardHeader>
            <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
          </CardHeader>

          <CardContent className="space-y-3">
            <h2 className="text-lg font-semibold">Itens</h2>
            <ul className="list-disc list-inside">
              {items.map((item) => (
                <li key={item.cod_barras}>
                  {item.quantity}x {item.nome} – R$ {(item.preco * item.quantity).toFixed(2)}
                  {item.observacao && (
                    <p className="text-sm text-gray-500">Obs: {item.observacao}</p>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <p><strong>Observação do pedido:</strong> {observacao || "Nenhuma"}</p>
              <p><strong>Endereço escolhido:</strong> {enderecoId ? `#${enderecoId}` : "Não informado"}</p>
              <p><strong>Forma de pagamento:</strong> {meioPagamentoId ? `#${meioPagamentoId}` : "Não informado"}</p>
              <p><strong>Total:</strong> R$ {totalPrice().toFixed(2)}</p>
            </div>
          </CardContent>

          <CardFooter className="w-full">
            <Button onClick={handleFinalizar} disabled={loading}>
              {loading ? "Enviando..." : "Finalizar Pedido"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
