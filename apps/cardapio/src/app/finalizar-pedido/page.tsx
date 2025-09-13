"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getCliente, getEnderecoPadraoId, getMeioPagamentoId, setEnderecoPadraoId, setMeioPagamentoId } from "@cardapio/stores/client/ClientStore";
import { useFinalizarPedido } from "@cardapio/services/useQueryFinalizarPedido";
import { useQueryEnderecos, useMutateEndereco, EnderecoCreate } from "@cardapio/services/useQueryEndereco";
import { useMeiosPagamento } from "@cardapio/services/useQueryMeioPagamento";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CardContent, CardFooter } from "@cardapio/components/Shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { CircleArrowRight, CircleCheck, Loader2, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // <--- IMPORT FRAMER MOTION
import Tabs from "@cardapio/components/Shared/ui/tabs";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";
import EnderecoStep from "@cardapio/components/Shared/finalizar-pedido/EnderecoStep";
import PagamentoStep from "@cardapio/components/Shared/finalizar-pedido/PagamentoStep";
import RevisaoStep from "@cardapio/components/Shared/finalizar-pedido/RevisaoStep";
import ObservacaoStep from "@cardapio/components/Shared/finalizar-pedido/ObservacaoStep";
import PedidoConfirmOverlay from "@cardapio/components/Shared/finalizar-pedido/PedidoConfirmOverlay";

export default function FinalizarPedidoPage() {
  const router = useRouter();
  const { items, totalPrice, observacao } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();

  const [cliente, setCliente] = useState<any>(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [meioPagamentoId, setPagamentoId] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<"endereco" | "pagamento" | "observacao" | "revisao">("endereco");

  const [confirmEnderecoOpen, setConfirmEnderecoOpen] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<"idle" | "loading" | "sucesso" | "erro">("idle");

  const { data: enderecos = [] } = useQueryEnderecos(cliente?.tokenCliente, { enabled: !!cliente?.tokenCliente });
  const { create, update, remove } = useMutateEndereco(cliente?.tokenCliente ?? "");
  const { data: meiosPagamento = [] } = useMeiosPagamento(!!cliente?.tokenCliente);

  useEffect(() => {
    const c = getCliente();
    if (!c?.tokenCliente) {
      setShowClienteModal(true);
    } else {
      setCliente(c);
      setEnderecoId(getEnderecoPadraoId());
      setPagamentoId(getMeioPagamentoId());
    }
  }, [items, router]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleFinalizar = async () => {
    setOverlayStatus("loading");
    setErrorMessage("");
    const result = await finalizarPedido();

    // Simula loading antes de mostrar sucesso/erro
    setTimeout(() => {
      if (result === "sucesso") {
        setOverlayStatus("sucesso");
        setTimeout(() => router.push("/pedidos"), 3000); // 3s para mostrar check
      } else if (result === "erro" || (typeof result === "object" && result.status === "erro")) {
        setOverlayStatus("erro");
        setErrorMessage(typeof result === "object" ? result.message : "Erro ao finalizar pedido");
        setTimeout(() => setOverlayStatus("idle"), 5000); // overlay erro 5s
      }
    }, 1500); // mantém loading por 1.5s
  };

  const renderFooterButton = () => {
    if (loading || overlayStatus === "loading") {
      return (
        <Button disabled className="w-full text-lg p-6 bg-gray-200 text-gray-700">
          <Loader2 className="animate-spin mr-2" size={20} />
          Enviando pedido...
        </Button>
      );
    }

    switch (currentTab) {
      case "endereco":
        return (
          <Button className="w-full text-lg p-6 bg-yellow-500" onClick={() => setConfirmEnderecoOpen(true)} disabled={!enderecoId}>
            Continuar para Pagamento <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "pagamento":
        return (
          <Button 
            className="w-full text-lg p-6 bg-amber-600" 
            onClick={() => setCurrentTab("observacao")}
            disabled={!meioPagamentoId}
          >
            Continuar <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "observacao":
        return (
          <Button className="w-full text-lg p-6 bg-indigo-800" onClick={() => setCurrentTab("revisao")}>
            Revisar Pedido <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "revisao":
        return (
          <Button onClick={handleFinalizar} disabled={items.length === 0} className="w-full text-lg p-6 bg-green-600">
            <div className="flex gap-3 items-center">
              Confirmar Pedido <CircleCheck strokeWidth={3} />
            </div>
          </Button>
        );
      default:
        return null;
    }
  };

  const handleClienteConfirm = () => {
    const c = getCliente();
    if (c) {
      setCliente(c);
      setEnderecoId(getEnderecoPadraoId());
      setPagamentoId(getMeioPagamentoId());
      setShowClienteModal(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-0 p-0 relative">
      {/* OVERLAY FULL SCREEN */}
      <AnimatePresence>
        {overlayStatus !== "idle" && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            {overlayStatus === "loading" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg"
              >
                <Loader2 className="animate-spin text-green-600" size={50} />
                <span className="text-lg font-medium">Enviando pedido...</span>
              </motion.div>
            )}
            {overlayStatus === "sucesso" && 
              <PedidoConfirmOverlay show={true} />
            }

            {overlayStatus === "erro" && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-4"
              >
                <XCircle size={120} className="text-red-600" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-red-600 block mb-2">Erro ao finalizar pedido</span>
                  <p className="text-sm text-gray-600">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CLIENTE */}
      <ClienteIdentificacaoModal open={showClienteModal} onClose={() => setShowClienteModal(false)} onConfirm={handleClienteConfirm} />

      {/* MODAL DE CONFIRMAÇÃO DE ENDEREÇO */}
      <Dialog open={confirmEnderecoOpen} onOpenChange={setConfirmEnderecoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar Endereço</DialogTitle>
            <strong className="text-primary">Você realmente está aqui?</strong>
          </DialogHeader>

          {enderecos.find((e) => e.id === enderecoId) ? (
            <div className="mt-3 text-sm text-muted-foreground">
              <strong>
                {enderecos.find((e) => e.id === enderecoId)?.logradouro},{" "}
                {enderecos.find((e) => e.id === enderecoId)?.numero}
              </strong>
              <br />
              {enderecos.find((e) => e.id === enderecoId)?.bairro} -{" "}
              {enderecos.find((e) => e.id === enderecoId)?.cidade}/
              {enderecos.find((e) => e.id === enderecoId)?.estado} •{" "}
              {enderecos.find((e) => e.id === enderecoId)?.cep}
            </div>
          ) : (
            <p className="text-sm text-red-500">Nenhum endereço selecionado.</p>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              onClick={() => {
                setConfirmEnderecoOpen(false);
                setCurrentTab("pagamento");
              }}
              className="w-full sm:w-auto"
              disabled={!enderecoId}
            >
              Sim, estou nesse endereço
            </Button>
            <Button variant="destructive" onClick={() => setConfirmEnderecoOpen(false)} className="w-full sm:w-auto">
              Não, trocar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONTEÚDO PRINCIPAL */}
      {cliente && (
        <div className="relative h-[80vh] flex flex-col">
          <CardContent className="flex-1 overflow-auto p-0">
            <Tabs
              value={currentTab}
              onValueChange={(v) => setCurrentTab(v as any)}
              triggerClassName="rounded-b-none"
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
                  value: "observacao",
                  label: "Observação",
                  Component: () => (
                    <ObservacaoStep
                      observacao={observacao}
                      onChange={(texto) => useCart.getState().setObservacao(texto)}
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
                      inc={useCart.getState().inc}
                      dec={useCart.getState().dec}
                      remove={useCart.getState().remove}
                    />
                  ),
                },
              ]}
            />
          </CardContent>

          <div className="flex font-bold bg-muted text-end text-primary gap-2 m-2 p-2">
            <span className="ml-auto">Total:</span>
            <span>R$ {totalPrice().toFixed(2)}</span>
          </div>

          <CardFooter className="w-full">{renderFooterButton()}</CardFooter>
        </div>
      )}
    </div>
  );
}
