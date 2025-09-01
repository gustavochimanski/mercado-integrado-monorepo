"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import {
  getCliente,
  getEnderecoPadraoId,
  getMeioPagamentoId,
  setEnderecoPadraoId,
  setMeioPagamentoId,
} from "@cardapio/stores/client/ClientStore";
import { useFinalizarPedido } from "@cardapio/services/useQueryFinalizarPedido";
import { useQueryEnderecos, useMutateEndereco, EnderecoCreate } from "@cardapio/services/useQueryEndereco";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@cardapio/components/Shared/ui/card";
import { CircleArrowRight, CircleCheck, Loader2 } from "lucide-react";
import Tabs from "@cardapio/components/Shared/ui/tabs";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";
import EnderecoStep from "@cardapio/components/Shared/finalizar-pedido/EnderecoStep";
import PagamentoStep from "@cardapio/components/Shared/finalizar-pedido/PagamentoStep";
import RevisaoStep from "@cardapio/components/Shared/finalizar-pedido/RevisaoStep";
import { useMeiosPagamento } from "@cardapio/services/useQueryMeioPagamento";

export default function FinalizarPedidoPage() {
  const { items, totalPrice, clear, observacao } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();
  const router = useRouter();

  // --- CLIENTE E PREFERÊNCIAS ---
  const [cliente, setCliente] = useState<any>(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [meioPagamentoId, setPagamentoId] = useState<number | null>(null);

  const [currentTab, setCurrentTab] = useState<"endereco" | "pagamento" | "revisao">("endereco");

  useEffect(() => {
    // verifica cliente
    const c = getCliente();
    if (!c?.tokenCliente) {
      setShowClienteModal(true);
    } else {
      setCliente(c);
      setEnderecoId(getEnderecoPadraoId());
      setPagamentoId(getMeioPagamentoId());
    }

    // redireciona se carrinho vazio
    if (items.length === 0) router.push("/");
  }, [items, router]);

  // --- ENDEREÇOS ---
  const { data: enderecos = [] } = useQueryEnderecos(cliente?.tokenCliente, { enabled: !!cliente?.tokenCliente });
  const { create, update, remove } = useMutateEndereco(cliente?.tokenCliente ?? "");
  const { data: meiosPagamento = [] } = useMeiosPagamento(!!cliente?.tokenCliente);

  // --- FINALIZAR PEDIDO ---
  const handleFinalizar = async () => {
    try {
      await finalizarPedido();
      // router.push("/pedido-confirmado");
    } catch (err) {
      console.error("Erro ao finalizar pedido", err);
    }
  };

  // --- FOOTER BOTÃO ---
  const renderFooterButton = () => {
    switch (currentTab) {
      case "endereco":
        return (
          <Button className="w-full text-lg p-6 bg-yellow-500" onClick={() => setCurrentTab("pagamento")}>
            Continuar para Pagamento <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "pagamento":
        return (
          <Button className="w-full text-lg p-6 bg-indigo-800" onClick={() => setCurrentTab("revisao")}>
            Revisar Pedido <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "revisao":
        return (
          <Button
            onClick={handleFinalizar}
            disabled={loading || items.length === 0}
            className="w-full text-lg p-6 bg-green-600"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Enviando pedido...
              </div>
            ) : (
              <div className="flex gap-3">
                Confirmar Pedido <CircleCheck className="my-auto" strokeWidth={3} />
              </div>
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  // --- HANDLER DO CLIENTE MODAL ---
  const handleClienteConfirm = () => {
    const c = getCliente();
    if (c) {
      setCliente(c);
      setEnderecoId(getEnderecoPadraoId());
      setPagamentoId(getMeioPagamentoId());
      setShowClienteModal(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <ClienteIdentificacaoModal
        open={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onConfirm={handleClienteConfirm}
      />

      {cliente && (
        <Card className="p-2 shadow-md h-[80vh] flex flex-col">
          <CardHeader>
            <h1 className="text-2xl font-bold">Finalizar Pedido</h1>
          </CardHeader>

          <CardContent className="flex-1">
            <Tabs
              value={currentTab}
              onValueChange={(v) => setCurrentTab(v as any)}
              items={[
                {
                  value: "endereco",
                  label: "Endereço",
                  Component: () => (
                    <EnderecoStep
                      enderecos={enderecos}
                      enderecoId={enderecoId}
                      onSelect={(id: number) => {
                        setEnderecoPadraoId(id);
                        setEnderecoId(id);
                      }}
                      onAdd={(novo: EnderecoCreate) => create.mutate(novo)}
                      onUpdate={(atualizado: any) => update.mutate(atualizado)}
                      onDelete={(id: number) => remove.mutate(id)}
                    />
                  ),
                },
                {
                  value: "pagamento",
                  label: "Pagamento",
                  Component: () => (
                    <PagamentoStep
                      meios={meiosPagamento}
                      selecionado={meioPagamentoId}
                      onSelect={(id: number) => {
                        setMeioPagamentoId(id);
                        setPagamentoId(id);
                      }}
                    />
                  ),
                },
                {
                  value: "revisao",
                  label: "Revisão",
                  Component: () => (
                    <RevisaoStep
                      items={items}
                      observacao={observacao}
                      endereco={enderecos.find((e) => e.id === enderecoId) ?? undefined}
                      pagamento={meiosPagamento.find((m) => m.id === meioPagamentoId) ?? undefined}
                      total={totalPrice() || 0}
                    />
                  ),
                },
              ]}
            />
          </CardContent>

          <CardFooter className="w-full">{renderFooterButton()}</CardFooter>
        </Card>
      )}
    </div>
  );
}
