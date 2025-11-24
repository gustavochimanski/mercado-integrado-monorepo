"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@cardapio/stores/cart/useCart";
import { getCliente, getEnderecoPadraoId, getMeioPagamentoId, getTokenCliente, setEnderecoPadraoId, setMeioPagamentoId } from "@cardapio/stores/client/ClientStore";
import { useQueryEnderecos, useMutateEndereco, Endereco } from "@cardapio/services/enderecos/useQueryEndereco";
import { useMeiosPagamento } from "@cardapio/services/meio-pagamento";
import { useMutatePedido } from "@cardapio/services/pedidos/useQueryPedido";
import { usePreviewCheckout } from "@cardapio/services/pedidos/usePreviewCheckout";
import { finalizarCheckoutCliente } from "@cardapio/services/pedidos/checkout-finalizar-pedido";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { useQueryClient } from "@tanstack/react-query";
import type { FinalizarPedidoRequest, TipoPedidoCheckout } from "@cardapio/types/pedido";
import { Button } from "@cardapio/components/Shared/ui/button";
import { CardContent, CardFooter } from "@cardapio/components/Shared/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@cardapio/components/Shared/ui/dialog";
import { CircleArrowRight, CircleCheck, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion"; // <--- IMPORT FRAMER MOTION
import Tabs from "@cardapio/components/Shared/ui/tabs";
import ClienteIdentificacaoModal from "@cardapio/components/Shared/finalizar-pedido/ClienteIdentificacaoModal";
import TipoPedidoStep, { TipoPedido } from "@cardapio/components/Shared/finalizar-pedido/TipoPedidoStep";
import MesaStep from "@cardapio/components/Shared/finalizar-pedido/MesaStep";
import BalcaoStep from "@cardapio/components/Shared/finalizar-pedido/BalcaoStep";
import EnderecoStep from "@cardapio/components/Shared/finalizar-pedido/EnderecoStep";
import PagamentoStep from "@cardapio/components/Shared/finalizar-pedido/PagamentoStep";
import RevisaoStep from "@cardapio/components/Shared/finalizar-pedido/RevisaoStep";
import ObservacaoStep from "@cardapio/components/Shared/finalizar-pedido/ObservacaoStep";
import PedidoConfirmOverlay from "@cardapio/components/Shared/finalizar-pedido/PedidoConfirmOverlay";
import { getEmpresaId, setEmpresaId, getMesaInicial, clearMesaInicial } from "@cardapio/stores/empresa/empresaStore";
import { toast } from "sonner";
import { useQueryEmpresasDisponiveis, EmpresaDisponivel } from "@cardapio/services/empresa";
import { useReceiveEmpresaFromQuery } from "@cardapio/stores/empresa/useReceiveEmpresaFromQuery";
import { mapCartToPedidoItems } from "@cardapio/stores/cart/mapCartToPedidoItems";
import { useCartHydrated } from "@cardapio/components/Shared/cart/useHydrated";

const STEP_ORDER = ["tipo", "mesa", "balcao", "endereco", "pagamento", "observacao", "revisao"] as const;
type CheckoutTab = (typeof STEP_ORDER)[number];

export default function FinalizarPedidoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, combos, receitas, totalPrice, observacao, editingPedidoId, stopEditingPedido, clear: clearCart } = useCart();
  const queryClient = useQueryClient();
  const { updatePedido } = useMutatePedido();
  const cartHydrated = useCartHydrated();

  const isEditingMode = editingPedidoId !== null;

  const [cliente, setCliente] = useState<any>(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [tipoPedido, setTipoPedido] = useState<TipoPedido>(null);
  const [mesaId, setMesaId] = useState<number | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [meioPagamentoId, setPagamentoId] = useState<number | null>(null);
  const [trocoPara, setTrocoPara] = useState<number | null>(null);
  const [mesaCodigo, setMesaCodigo] = useState<string | null>(null);
  const [numPessoas, setNumPessoas] = useState<number | null>(null);
  const [balcaoEmpresaId, setBalcaoEmpresaId] = useState<number | null>(null);
  const balcaoEmpresaIdRef = useRef<number | null>(null);
  const [currentTab, setCurrentTab] = useState<CheckoutTab>("tipo");
  useReceiveEmpresaFromQuery();
  const [mesaPresetAplicada, setMesaPresetAplicada] = useState(false);

  const ensureClienteIdentificado = useCallback(() => {
    const clienteAtual = getCliente();
    const tokenAtual = clienteAtual?.tokenCliente ?? getTokenCliente();

    if (!tokenAtual) {
      setShowClienteModal(true);
      return false;
    }

    if (!clienteAtual.tokenCliente && tokenAtual) {
      clienteAtual.tokenCliente = tokenAtual;
    }

    if (!cliente?.tokenCliente) {
      setCliente(clienteAtual);
      setEnderecoId(getEnderecoPadraoId());
      setPagamentoId(getMeioPagamentoId());
    }

    return true;
  }, [cliente?.tokenCliente]);

  const handleClienteModalToggle = useCallback(
    (openState?: boolean) => {
      if (openState === true) {
        setShowClienteModal(true);
        return;
      }

      if (ensureClienteIdentificado()) {
        setShowClienteModal(false);
      } else {
        setShowClienteModal(true);
      }
    },
    [ensureClienteIdentificado]
  );

  const handleClienteConfirm = useCallback(() => {
    if (ensureClienteIdentificado()) {
      setShowClienteModal(false);
    }
  }, [ensureClienteIdentificado]);

  // Lê parâmetro ?mesa=X da URL e pré-seleciona
  useEffect(() => {
    const mesaParam = searchParams.get("mesa");
    if (mesaParam) {
      const mesaIdFromUrl = parseInt(mesaParam, 10);
      if (!isNaN(mesaIdFromUrl) && mesaIdFromUrl > 0) {
        if (ensureClienteIdentificado()) {
          setTipoPedido("MESA"); // Define automaticamente como pedido de mesa
          setCurrentTab("mesa"); // Vai direto para a aba de mesa
          setMesaCodigo(mesaParam);
        }
      }
    }
  }, [searchParams, ensureClienteIdentificado]);

  useEffect(() => {
    if (tipoPedido !== "MESA") {
      setNumPessoas(null);
      setMesaId(null);
    }

    if (tipoPedido === "DELIVERY") {
      setMesaCodigo(null);
    }

    if (tipoPedido !== "BALCAO") {
      setBalcaoEmpresaId(null);
    }
  }, [tipoPedido]);

  const [confirmEnderecoOpen, setConfirmEnderecoOpen] = useState(false);
  const [overlayStatus, setOverlayStatus] = useState<"idle" | "loading" | "sucesso" | "erro">("idle");
  const [overlayMessage, setOverlayMessage] = useState("");
  const [isFinalizando, setIsFinalizando] = useState(false);

  const { create, update, remove } = useMutateEndereco();
  const { data: meiosPagamento = [], isLoading: isLoadingPagamento, error: errorPagamento } = useMeiosPagamento(!!cliente?.tokenCliente);

  const { data: enderecosOut = [] } = useQueryEnderecos({ enabled: !!cliente?.tokenCliente });

  const {
    data: empresasDisponiveis = [],
    isLoading: isLoadingEmpresas,
    isError: isErrorEmpresas,
  } = useQueryEmpresasDisponiveis();

  useEffect(() => {
    const empresaAtual = getEmpresaId();
    if ((!empresaAtual || empresaAtual <= 0) && empresasDisponiveis.length > 0) {
      const primeiraEmpresa = empresasDisponiveis[0];
      if (primeiraEmpresa?.id) {
        setEmpresaId(primeiraEmpresa.id);
        if (!balcaoEmpresaId) {
          setBalcaoEmpresaId(primeiraEmpresa.id);
        }
      }
    }
  }, [empresasDisponiveis, balcaoEmpresaId]);

  useEffect(() => {
    if (tipoPedido === "BALCAO" && !balcaoEmpresaId) {
      const empresaAtual = getEmpresaId();
      if (empresaAtual && empresaAtual > 0) {
        setBalcaoEmpresaId(empresaAtual);
      }
    }
  }, [tipoPedido, balcaoEmpresaId]);

  useEffect(() => {
    if (
      tipoPedido === "BALCAO" &&
      empresasDisponiveis.length === 1 &&
      !balcaoEmpresaId
    ) {
      setBalcaoEmpresaId(empresasDisponiveis[0].id);
    }
  }, [tipoPedido, empresasDisponiveis, balcaoEmpresaId]);

  // Atualizar ref quando balcaoEmpresaId mudar
  useEffect(() => {
    balcaoEmpresaIdRef.current = balcaoEmpresaId;
  }, [balcaoEmpresaId]);

  useEffect(() => {
    if (tipoPedido !== "BALCAO") {
      return;
    }

    const currentBalcaoEmpresaId = balcaoEmpresaIdRef.current;
    
    if (!currentBalcaoEmpresaId) {
      return;
    }

    // Verificar se a empresa ainda existe na lista
    const empresaExiste = empresasDisponiveis.some(
      (empresa: EmpresaDisponivel) => empresa.id === currentBalcaoEmpresaId
    );

    // Só atualizar se a empresa não existir
    // Usar ref para evitar loop infinito
    if (!empresaExiste) {
      setBalcaoEmpresaId(null);
    }
  }, [tipoPedido, empresasDisponiveis]); // Removido balcaoEmpresaId das dependências para evitar loop

useEffect(() => {
  if (mesaPresetAplicada) {
    return;
  }

  const { codigo, numPessoas: pessoas } = getMesaInicial();
  if (!codigo) {
    setMesaPresetAplicada(true);
    return;
  }

  if (tipoPedido && tipoPedido !== "MESA") {
    setMesaPresetAplicada(true);
    return;
  }

  setTipoPedido("MESA");
  setMesaCodigo(codigo);
  const mesaNumero = Number(codigo);
  if (Number.isFinite(mesaNumero) && mesaNumero > 0) {
    setMesaId(Math.trunc(mesaNumero));
  }
  if (pessoas && Number.isFinite(pessoas) && pessoas > 0) {
    setNumPessoas(Math.trunc(pessoas));
  }
  setCurrentTab("mesa");
  setMesaPresetAplicada(true);
}, [mesaPresetAplicada, tipoPedido]);

  // Busca preview do checkout quando estiver na aba de revisão
  const { data: previewData, isLoading: isLoadingPreview } = usePreviewCheckout({
    tipoPedido,
    enderecoId,
    meioPagamentoId,
    mesaCodigo,
    numPessoas,
    trocoPara,
    empresaSelecionadaId: tipoPedido === "BALCAO" ? balcaoEmpresaId : null,
    enabled: currentTab === "revisao",
  });

const enderecos: Endereco[] = enderecosOut.map((e) => ({
  id: e.id,
  logradouro: e.logradouro || "",
  numero: e.numero || "", // <- corrige aqui
  bairro: e.bairro || "",
  distrito: undefined, // EnderecoOut não tem distrito, mas EnderecoStep espera
  cidade: e.cidade || "",
  estado: e.estado || "",
  cep: e.cep || "",
  complemento: e.complemento || "",
  latitude: e.latitude ?? 0,
  longitude: e.longitude ?? 0,
  ponto_referencia: e.ponto_referencia || "",
  padrao: e.padrao ?? false,
}));

  // Verificar identificação do cliente apenas uma vez ao montar ou quando necessário
  useEffect(() => {
    const clienteAtual = getCliente();
    const tokenAtual = clienteAtual?.tokenCliente ?? getTokenCliente();

    if (!tokenAtual) {
      setShowClienteModal(true);
      return;
    }

    if (!cliente?.tokenCliente) {
      if (clienteAtual) {
        if (!clienteAtual.tokenCliente && tokenAtual) {
          clienteAtual.tokenCliente = tokenAtual;
        }
        setCliente(clienteAtual);
        setEnderecoId(getEnderecoPadraoId());
        setPagamentoId(getMeioPagamentoId());
      }
    }
  }, []); // Executar apenas uma vez ao montar

  // Limpar modo de edição se não houver itens e não estiver realmente editando um pedido
  // Executar apenas após a hidratação do carrinho para evitar limpar antes dos dados serem restaurados
  useEffect(() => {
    // Aguardar a hidratação do carrinho antes de fazer verificações
    if (!cartHydrated) return;

    // Se editingPedidoId está definido mas não há itens, combos ou receitas, limpar o modo de edição
    // Isso pode acontecer se o editingPedidoId ficou "preso" no localStorage
    if (editingPedidoId !== null) {
      const totalItems = items.length + (combos?.length || 0) + (receitas?.length || 0);
      if (totalItems === 0) {
        // Se não há itens, não deveria estar em modo de edição
        stopEditingPedido();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartHydrated]); // Executar após a hidratação do carrinho

  const [errorMessage, setErrorMessage] = useState("");

  const resolveClienteId = () => {
    const candidate = cliente?.id ?? getCliente()?.id;
    if (candidate === undefined || candidate === null) {
      return null;
    }
    const parsed = typeof candidate === "number" ? candidate : Number(candidate);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    return parsed;
  };

  const ensurePositiveInteger = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return null;
    }
    if (!Number.isFinite(value) || value <= 0) {
      return null;
    }
    return Math.trunc(value);
  };

  const handleFinalizar = async () => {
    if (!ensureClienteIdentificado()) {
      setErrorMessage("Identifique-se para finalizar o pedido.");
      setOverlayMessage("Identifique-se para finalizar o pedido.");
      setOverlayStatus("erro");
      setTimeout(() => setOverlayStatus("idle"), 1500);
      return;
    }

    setOverlayStatus("loading");
    setErrorMessage("");
    setOverlayMessage("");
    setIsFinalizando(true);

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
          onSettled: () => {
            setIsFinalizando(false);
          },
          onSuccess: () => {
            clearMesaInicial();
            // Após atualizar pedido editado, desativa modo edição
            setTimeout(() => {
              setOverlayStatus("sucesso");
              stopEditingPedido(); // Limpa o modo edição
              queryClient.invalidateQueries({ queryKey: ["pedidos"] });
              setTimeout(() => router.push("/pedidos"), 3000);
            }, 1500);
          },
          onError: (error: any) => {
            setTimeout(() => {
              setOverlayStatus("erro");
              const message = extractErrorMessage(error, "Erro ao atualizar pedido");
              setOverlayMessage(message);
              setErrorMessage(message);
            }, 1500);
          },
        }
      );
    } else {
      // Modo normal: cria novo pedido
      let validationError: string | null = null;

      if (!tipoPedido) {
        validationError = "Selecione o tipo de pedido antes de finalizar.";
      } else if (!getTokenCliente() && tipoPedido === "DELIVERY") {
        validationError = "Cliente não identificado. Faça login novamente.";
      } else if (!enderecoId && tipoPedido === "DELIVERY") {
        validationError = "Endereço não selecionado. Selecione um endereço de entrega.";
      } else if (!meioPagamentoId && tipoPedido === "DELIVERY") {
        validationError = "Forma de pagamento não selecionada. Escolha uma forma de pagamento.";
      } else {
        // Verificar se o meio de pagamento é dinheiro e se o troco está preenchido (apenas para DELIVERY)
        if (tipoPedido === "DELIVERY") {
          const meioSelecionado = meiosPagamento.find(m => m.id === meioPagamentoId);
          if (meioSelecionado?.tipo === "DINHEIRO" && (!trocoPara || trocoPara <= 0)) {
            validationError = "Informe o valor do troco para pagamento em dinheiro.";
          }
        }
      }
      
      if (!validationError) {
        if (tipoPedido === "MESA" && !mesaCodigo) {
          validationError = "Informe o código/número da mesa.";
        } else if (tipoPedido === "BALCAO" && !balcaoEmpresaId) {
          validationError = "Selecione a unidade para retirada no balcão.";
        }
      }

      if (validationError) {
        setTimeout(() => {
          setOverlayStatus("erro");
          setOverlayMessage(validationError);
          setErrorMessage(validationError);
          setIsFinalizando(false);
        }, 1500);
        return;
      }

      try {
        const empresaIdLoja = ensurePositiveInteger(getEmpresaId());
        let empresaIdPayload: number | null = null;

        // Converter itens do carrinho para formato aninhado em produtos
        const { produtos } = 
          mapCartToPedidoItems(items, combos || [], receitas || []);

        const tipoSelecionado = tipoPedido as TipoPedidoCheckout;

        if (tipoSelecionado === "BALCAO") {
          const empresaSelecionada = ensurePositiveInteger(balcaoEmpresaId);
          if (!empresaSelecionada) {
            throw new Error("Selecione a unidade para retirada no balcão antes de finalizar.");
          }
          empresaIdPayload = empresaSelecionada;
          setEmpresaId(empresaSelecionada);
        } else if (tipoSelecionado === "MESA") {
          if (!empresaIdLoja) {
            throw new Error("Empresa não encontrada. Recarregue a página e tente novamente.");
          }
          empresaIdPayload = empresaIdLoja;
        }

        // Obter valor total do preview ou usar totalPrice como fallback
        const valorTotal = previewData?.valor_total ?? totalPrice();

        const payload: FinalizarPedidoRequest = {
          tipo_pedido: tipoSelecionado,
          origem: "WEB",
          observacao_geral: observacao || undefined,
          produtos,
          cliente_id: resolveClienteId(),
        };

        // Para DELIVERY, empresa_id deve ser null (não undefined)
        if (tipoPedido === "DELIVERY") {
          payload.empresa_id = null;
          payload.tipo_entrega = "DELIVERY";
          payload.endereco_id = enderecoId as number;
          payload.troco_para = trocoPara ?? null;
          payload.mesa_codigo = null;
          
          // Usar meios_pagamento ao invés de meio_pagamento_id na raiz
          if (meioPagamentoId) {
            payload.meios_pagamento = [
              {
                meio_pagamento_id: meioPagamentoId,
                valor: valorTotal,
              },
            ];
          }
        } else {
          // Para MESA e BALCAO, incluir empresa_id
          if (empresaIdPayload) {
            payload.empresa_id = empresaIdPayload;
          }
          
          if (tipoPedido === "MESA") {
            const codigoMesa = mesaCodigo ?? (mesaId !== null ? String(mesaId) : undefined);
            if (codigoMesa) {
              payload.mesa_codigo = codigoMesa;
            }
            payload.num_pessoas = numPessoas ?? null;
          } else if (tipoPedido === "BALCAO") {
            const codigoRetirada = mesaCodigo ?? (mesaId !== null ? String(mesaId) : undefined);
            if (codigoRetirada) {
              payload.mesa_codigo = codigoRetirada;
            }
          }
          
          payload.troco_para = trocoPara ?? null;
          
          // Usar meios_pagamento se houver meio de pagamento selecionado
          if (meioPagamentoId) {
            payload.meios_pagamento = [
              {
                meio_pagamento_id: meioPagamentoId,
                valor: valorTotal,
              },
            ];
          }
        }

        await finalizarCheckoutCliente(payload);
        clearMesaInicial();

        clearCart();
        queryClient.invalidateQueries({ queryKey: ["pedidos"] });

        setOverlayMessage("Pedido enviado com sucesso!");
        setTimeout(() => {
          setOverlayStatus("sucesso");
          setTimeout(() => router.push("/pedidos"), 3000);
          setIsFinalizando(false);
        }, 1500);
      } catch (error: any) {
        const message = extractErrorMessage(error, "Erro ao processar pedido. Tente novamente.");
        setTimeout(() => {
          setOverlayStatus("erro");
          setOverlayMessage(message);
          setErrorMessage(message);
          setIsFinalizando(false);
        }, 1500);
      }
    }
  };

  const renderFooterButton = () => {
    if (isFinalizando || overlayStatus === "loading") {
      return (
        <Button disabled className="w-full text-lg p-6 bg-gray-200 text-gray-700">
          <Loader2 className="animate-spin mr-2" size={20} />
          Enviando pedido...
        </Button>
      );
    }

    switch (currentTab) {
      case "tipo":
        return (
          <Button 
            className="w-full text-lg p-6 bg-primary" 
            onClick={() => {
              if (!ensureClienteIdentificado()) {
                return;
              }
              if (tipoPedido === "MESA") {
                setCurrentTab("mesa");
              } else if (tipoPedido === "BALCAO") {
                setCurrentTab("balcao");
              } else if (tipoPedido === "DELIVERY") {
                setCurrentTab("endereco");
              }
            }}
            disabled={!tipoPedido}
          >
            Continuar <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "mesa":
        return (
          <Button 
            className="w-full text-lg p-6 bg-blue-600" 
            onClick={() => setCurrentTab("observacao")}
            disabled={!mesaCodigo}
          >
            Continuar <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "balcao":
        return (
          <Button 
            className="w-full text-lg p-6 bg-green-600" 
            onClick={() => setCurrentTab("observacao")}
            disabled={!balcaoEmpresaId}
          >
            Continuar <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "endereco":
        return (
          <Button className="w-full text-lg p-6 bg-yellow-500" onClick={() => setConfirmEnderecoOpen(true)} disabled={!enderecoId}>
            Continuar para Pagamento <CircleArrowRight strokeWidth={3} />
          </Button>
        );
      case "pagamento":
        const meioSelecionado = meiosPagamento.find(m => m.id === meioPagamentoId);
        const isDinheiro = meioSelecionado?.tipo === "DINHEIRO";
        const trocoObrigatorioPreenchido = !isDinheiro || (isDinheiro && trocoPara !== null && trocoPara !== undefined && trocoPara > 0);
        return (
          <Button 
            className="w-full text-lg p-6 bg-amber-600" 
            onClick={() => setCurrentTab("observacao")}
            disabled={!meioPagamentoId || !trocoObrigatorioPreenchido}
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
          <Button onClick={handleFinalizar} disabled={items.length === 0 && combos?.length === 0 && receitas?.length === 0} className="w-full text-lg p-6 bg-green-600">
          <div className="flex gap-3 items-center">
            {isEditingMode ? "Atualizar Pedido" : "Confirmar Pedido"} <CircleCheck strokeWidth={3} />
          </div>
        </Button>
      );
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
              onValueChange={(v) => {
                if (!STEP_ORDER.includes(v as CheckoutTab)) {
                  return;
                }
                const target = v as CheckoutTab;
                const currentIndex = STEP_ORDER.indexOf(currentTab);
                const targetIndex = STEP_ORDER.indexOf(target);

                // permite voltar (ou manter) via clique; avanço continua controlado pelos botões do fluxo
                if (targetIndex <= currentIndex) {
                  setCurrentTab(target);
                }
              }}
              triggerClassName="rounded-b-none"
              items={[
                {
                  value: "tipo",
                  label: "Tipo",
                  Component: () => (
                    <TipoPedidoStep
                      tipoSelecionado={tipoPedido}
                      onSelect={(tipo) => {
                        if (tipo && !ensureClienteIdentificado()) {
                          setTipoPedido(null);
                          return;
                        }
                        setTipoPedido(tipo);
                      }}
                    />
                  ),
                },
                {
                  value: "mesa",
                  label: "Mesa",
                  Component: () => (
                    <MesaStep
                      mesaId={mesaId}
                      mesaCodigo={mesaCodigo}
                      numPessoas={numPessoas}
                      onSelect={(id, codigo) => {
                        setMesaId(id);
                        setMesaCodigo(codigo ?? null);
                      }}
                      onNumPessoasChange={(valor) => setNumPessoas(valor)}
                    />
                  ),
                  hidden: tipoPedido !== "MESA",
                },
                {
                  value: "balcao",
                  label: "Balcão",
                  Component: () => (
                    <BalcaoStep
                      mesaCodigo={mesaCodigo}
                      onMesaCodigoChange={(codigo) => {
                        setMesaCodigo(codigo ?? null);
                        const parsed = ensurePositiveInteger(codigo ? Number(codigo) : null);
                        setMesaId(parsed);
                      }}
                      empresas={empresasDisponiveis}
                      empresaSelecionadaId={balcaoEmpresaId}
                      onEmpresaSelecionadaChange={setBalcaoEmpresaId}
                      isLoadingEmpresas={isLoadingEmpresas}
                      carregamentoFalhou={isErrorEmpresas}
                    />
                  ),
                  hidden: tipoPedido !== "BALCAO",
                },
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
                      onAdd={(novo) => {
                        const clienteId = resolveClienteId();
                        if (!clienteId) {
                          toast.error("Não foi possível identificar o cliente. Faça login novamente para cadastrar um endereço.");
                          return;
                        }
                        create.mutate({ ...novo, cliente_id: clienteId });
                      }}
                      onUpdate={(atualizado) => {
                        const clienteId = resolveClienteId();
                        if (!clienteId) {
                          toast.error("Não foi possível identificar o cliente. Faça login novamente para atualizar o endereço.");
                          return;
                        }
                        update.mutate({ ...atualizado, cliente_id: clienteId });
                      }}
                      onDelete={(id: number) => remove.mutate(id)}
                    />
                  ),
                  hidden: tipoPedido !== "DELIVERY",
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
                  hidden: tipoPedido === "MESA" || tipoPedido === "BALCAO",
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
                      combos={combos}
                      receitas={receitas}
                      observacao={observacao}
                      endereco={tipoPedido === "DELIVERY" ? enderecos.find((e) => e.id === enderecoId) ?? undefined : undefined}
                      pagamento={meiosPagamento.find((m) => m.id === meioPagamentoId) ?? undefined}
                      trocoPara={trocoPara}
                      total={(previewData?.valor_total ?? totalPrice()) || 0}
                      previewData={previewData ?? undefined}
                      isLoadingPreview={isLoadingPreview}
                      inc={useCart.getState().inc}
                      dec={useCart.getState().dec}
                      remove={useCart.getState().remove}
                      incCombo={useCart.getState().incCombo}
                      decCombo={useCart.getState().decCombo}
                      removeCombo={useCart.getState().removeCombo}
                      incReceita={useCart.getState().incReceita}
                      decReceita={useCart.getState().decReceita}
                      removeReceita={useCart.getState().removeReceita}
                      tipoPedido={tipoPedido}
                      mesaCodigo={mesaCodigo ?? undefined}
                      numPessoas={numPessoas ?? undefined}
                    />
                  ),
                },
              ].filter(item => !item.hidden)}
            />
          </CardContent>

          <div className="flex font-bold bg-muted text-end text-primary gap-2 m-2 p-2">
            <span className="ml-auto">Total:</span>
            <span>R$ {((previewData?.valor_total ?? totalPrice()) || 0).toFixed(2)}</span>
          </div>

          <CardFooter className="w-full p-2 pb-2">{renderFooterButton()}</CardFooter>
        </div>
      )}
    </div>
  );
}
