"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getCliente, getEnderecoPadraoId, getMeioPagamentoId, setEnderecoPadraoId, setMeioPagamentoId } from "@cardapio/stores/client/ClientStore";
import { useFinalizarPedido } from "@cardapio/services/useQueryFinalizarPedido";
import { useQueryEnderecos, useMutateEndereco, EnderecoCreate, Endereco } from "@cardapio/services/useQueryEndereco";
import { useMeiosPagamento } from "@cardapio/services/useQueryMeioPagamento";
import { useMutatePedido } from "@cardapio/services/useQueryPedido";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CardContent, CardFooter } from "@cardapio/components/Shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { CircleArrowRight, CircleCheck, Loader2 } from "lucide-react";
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
  const { items, totalPrice, observacao, editingPedidoId, stopEditingPedido } = useCart();
  const { finalizarPedido, loading } = useFinalizarPedido();

  const isEditingMode = editingPedidoId !== null;

  const [cliente, setCliente] = useState<any>(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [meioPagamentoId, setPagamentoId] = useState<number | null>(null);
  const [trocoPara, setTrocoPara] = useState<number | null>(null);
  const [currentTab, setCurrentTab] = useState<"endereco" | "pagamento" | "observacao" | "revisao">("endereco");

  const [confirmEnderecoOpen, setConfirmEnderecoOpen] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<"idle" | "loading" | "sucesso" | "erro">("idle");
  const [overlayMessage, setOverlayMessage] = useState("");

  const { create, update, remove } = useMutateEndereco();
  const { data: meiosPagamento = [], isLoading: isLoadingPagamento, error: errorPagamento } = useMeiosPagamento(!!cliente?.tokenCliente);
  const { updatePedido } = useMutatePedido();

  const { data: enderecosOut = [] } = useQueryEnderecos({ enabled: !!cliente?.tokenCliente });

const enderecos: Endereco[] = enderecosOut.map((e) => ({
  id: e.id,
  logradouro: e.logradouro || "",
  numero: e.numero || "", // <- corrige aqui
  bairro: e.bairro || "",
  cidade: e.cidade || "",
  estado: e.estado || "",
  cep: e.cep || "",
  complemento: e.complemento || "",
  latitude: e.latitude ?? 0,
  longitude: e.longitude ?? 0,
  ponto_referencia: e.ponto_referencia || "",
  padrao: e.padrao ?? false,
}));


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
    setOverlayMessage("");

    if (isEditingMode && editingPedidoId) {
      // Modo edição: atualiza pedido existente
      const itensParaEnviar = items.map(item => ({
        id: 0, // Novo item não tem id
        produto_cod_barras: item.cod_barras,
        quantidade: item.quantity,
        observacao: item.observacao || "",
        acao: "EDITAR",
      }));

      updatePedido.mutate(
        {
          id: editingPedidoId,
          data: {
            itens: itensParaEnviar,
            observacao_geral: observacao,
            meio_pagamento_id: meioPagamentoId,
            endereco_id: enderecoId,
          },
        },
        {
          onSuccess: () => {
            setTimeout(() => {
              setOverlayStatus("sucesso");
              stopEditingPedido(); // Limpa o modo edição
              setTimeout(() => router.push("/pedidos"), 3000);
            }, 1500);
          },
          onError: (error: any) => {
            setTimeout(() => {
              setOverlayStatus("erro");
              const message = error?.response?.data?.message || "Erro ao atualizar pedido";
              setOverlayMessage(message);
              setErrorMessage(message);
            }, 1500);
          },
        }
      );
    } else {
      // Modo normal: cria novo pedido
      const result = await finalizarPedido(trocoPara);

      setTimeout(() => {
        if (result === "sucesso") {
          setOverlayStatus("sucesso");
          setTimeout(() => router.push("/pedidos"), 3000);
        } else if (typeof result === "object" && result.status === "erro") {
          setOverlayStatus("erro");
          setOverlayMessage(result.message);
          setErrorMessage(result.message);
        }
      }, 1500);
    }
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
              {isEditingMode ? "Atualizar Pedido" : "Confirmar Pedido"} <CircleCheck strokeWidth={3} />
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
              <PedidoConfirmOverlay show={true} type="success" />
            }

            {overlayStatus === "erro" && (
              <PedidoConfirmOverlay 
                show={true} 
                type="error" 
                message={overlayMessage}
                onClose={() => setOverlayStatus("idle")}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL CLIENTE */}
      <ClienteIdentificacaoModal open={showClienteModal} onClose={() => setShowClienteModal(false)} onConfirm={handleClienteConfirm} />

      {/* MODAL DE CONFIRMAÇÃO DE ENDEREÇO */}
      <Dialog open={confirmEnderecoOpen} onOpenChange={setConfirmEnderecoOpen}>
        <DialogContent className="!max-w-md">
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
        <div className="relative h-[calc(100vh-4rem)] flex flex-col">
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
                  Component: () => {
                    if (isLoadingPagamento) {
                      return (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-sm text-muted-foreground">Carregando formas de pagamento...</p>
                          </div>
                        </div>
                      );
                    }

                    if (errorPagamento) {
                      return (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-2">
                            <p className="text-destructive font-medium">Erro ao carregar formas de pagamento</p>
                            <p className="text-sm text-muted-foreground">Tente novamente mais tarde</p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <PagamentoStep
                        meios={meiosPagamento}
                        selecionado={meioPagamentoId}
                        onSelect={(id: number) => {
                          setMeioPagamentoId(id);
                          setPagamentoId(id);
                        }}
                        onTrocoChange={(valor) => setTrocoPara(valor)}
                      />
                    );
                  },
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
                      trocoPara={trocoPara}
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

          <CardFooter className="w-full p-2 pb-2">{renderFooterButton()}</CardFooter>
        </div>
      )}
    </div>
  );
}
