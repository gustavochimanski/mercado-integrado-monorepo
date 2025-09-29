"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pedido } from "@cardapio/types/pedido";
import { useMutatePedido } from "@cardapio/services/useQueryPedido";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Textarea } from "@cardapio/components/Shared/ui/textarea";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Input } from "@cardapio/components/Shared/ui/input";
import Tabs from "@cardapio/components/Shared/ui/tabs";
import { useMeiosPagamento } from "@cardapio/services/useQueryMeioPagamento";
import { useQueryEnderecos } from "@cardapio/services/useQueryEndereco";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@cardapio/components/Shared/ui/select";
import { Edit, MapPin } from "lucide-react";

// Schemas separados para cada tab
const itemEditadoSchema = z.object({
  id: z.number().optional(),
  produto_cod_barras: z.string(),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  observacao: z.string().optional(),
  acao: z.enum(["MANTER", "EDITAR", "REMOVER"]),
});

const editarPedidoGeralSchema = z.object({
  meio_pagamento_id: z.number().optional(),
  endereco_id: z.number().optional(),
  cupom_id: z.number().optional(),
  observacao_geral: z.string().optional(),
  troco_para: z.number().optional(),
});

const editarItensSchema = z.object({
  itens: z.array(itemEditadoSchema),
});

type EditarPedidoGeralData = z.infer<typeof editarPedidoGeralSchema>;
type EditarItensData = z.infer<typeof editarItensSchema>;

interface Props {
  pedido: Pedido | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEditarPedido({ pedido, isOpen, onClose }: Props) {
  const { toggleModoEdicao, updatePedido } = useMutatePedido();
  const { data: meiosPagamento = [] } = useMeiosPagamento();
  const { data: enderecos = [] } = useQueryEnderecos();
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modoEdicaoAtivo, setModoEdicaoAtivo] = useState(false);
  const modoEdicaoJaAtivado = useRef(false);
  const [loadingGeral, setLoadingGeral] = useState(false);
  const [loadingItens, setLoadingItens] = useState(false);

  // Form para dados gerais do pedido
  const formGeral = useForm<EditarPedidoGeralData>({
    resolver: zodResolver(editarPedidoGeralSchema),
    defaultValues: {
      meio_pagamento_id: undefined,
      endereco_id: undefined,
      cupom_id: undefined,
      observacao_geral: "",
      troco_para: undefined,
    },
  });

  // Form para itens do pedido
  const formItens = useForm<EditarItensData>({
    resolver: zodResolver(editarItensSchema),
    defaultValues: {
      itens: [],
    },
  });

  const itensWatch = formItens.watch("itens") || [];

  // Funções para manipular itens
  const atualizarQuantidade = (index: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    const itens = formItens.getValues("itens");
    itens[index].quantidade = novaQuantidade;
    itens[index].acao = "EDITAR";
    formItens.setValue("itens", itens);
  };

  const atualizarObservacao = (index: number, observacao: string) => {
    const itens = formItens.getValues("itens");
    itens[index].observacao = observacao;
    itens[index].acao = "EDITAR";
    formItens.setValue("itens", itens);
  };

  const removerItem = (index: number) => {
    const itens = formItens.getValues("itens");
    itens[index].acao = "REMOVER";
    formItens.setValue("itens", itens);
  };

  const restaurarItem = (index: number) => {
    const itens = formItens.getValues("itens");
    itens[index].acao = "MANTER";
    formItens.setValue("itens", itens);
  };

  // Carrega dados do pedido quando abre o modal
  useEffect(() => {
    if (pedido && isOpen) {
      // Carrega dados gerais - preenche com valores atuais do pedido

      // Busca o meio de pagamento pelo nome
      const meioPagamentoAtual = meiosPagamento.find(mp => mp.nome === pedido.meio_pagamento_nome);
      formGeral.setValue("meio_pagamento_id", meioPagamentoAtual?.id || undefined);

      formGeral.setValue("endereco_id", pedido.endereco_id || undefined);
      formGeral.setValue("cupom_id", pedido.cupom_id || undefined);
      formGeral.setValue("observacao_geral", pedido.observacao_geral || "");
      formGeral.setValue("troco_para", pedido.troco_para || undefined);

      // Carrega os itens do pedido para edição
      const itensEditaveis = pedido.itens.map(item => ({
        id: item.id,
        produto_cod_barras: item.produto_cod_barras,
        quantidade: item.quantidade,
        observacao: item.observacao || "",
        acao: "MANTER" as const,
      }));
      formItens.setValue("itens", itensEditaveis);

      setModoEdicaoAtivo(true);
      setIsLoading(false);
    } else if (!isOpen) {
      setModoEdicaoAtivo(false);
      modoEdicaoJaAtivado.current = false;
    }
  }, [pedido, isOpen, formGeral, formItens, meiosPagamento]);

  const handleClose = async () => {
    if (pedido && modoEdicaoAtivo) {
      setIsLoading(true);
      toggleModoEdicao.mutate(
        { id: pedido.id, modo: false },
        {
          onSuccess: () => {
            setModoEdicaoAtivo(false);
            setIsLoading(false);
            onClose();
          },
          onError: () => {
            setModoEdicaoAtivo(false);
            setIsLoading(false);
            onClose();
          },
        }
      );
    } else {
      setModoEdicaoAtivo(false);
      onClose();
    }
  };

  // Submit para dados gerais do pedido
  const onSubmitGeral = async (data: EditarPedidoGeralData) => {
    if (!pedido) return;

    setLoadingGeral(true);

    const dadosCompletos: Record<string, unknown> = {};

    // Só adiciona campos que foram preenchidos
    if (data.meio_pagamento_id) dadosCompletos.meio_pagamento_id = data.meio_pagamento_id;
    if (data.endereco_id) dadosCompletos.endereco_id = data.endereco_id;
    if (data.cupom_id) dadosCompletos.cupom_id = data.cupom_id;
    if (data.observacao_geral?.trim()) dadosCompletos.observacao_geral = data.observacao_geral.trim();
    if (data.troco_para) dadosCompletos.troco_para = data.troco_para;

    updatePedido.mutate(
      {
        id: pedido.id,
        data: dadosCompletos,
      },
      {
        onSuccess: () => {
          setLoadingGeral(false);
          handleClose(); // Fecha o modal após sucesso
        },
        onError: () => {
          setLoadingGeral(false);
        },
      }
    );
  };

  // Submit para itens do pedido
  const onSubmitItens = async () => {
    if (!pedido) return;

    setLoadingItens(true);

    // TODO: Implementar endpoint específico para itens quando descobrir qual é

    setLoadingItens(false);
  };


  // Renderiza tab de dados gerais
  const renderDadosGerais = () => {
    if (!pedido) return null;

    const meioPagamentoSelecionado = formGeral.watch("meio_pagamento_id");
    const meioPagamento = meiosPagamento.find(mp => mp.id === meioPagamentoSelecionado);
    const isDinheiro = meioPagamento?.tipo === "DINHEIRO";
    const enderecoSelecionado = enderecos.find(end => end.id === formGeral.watch("endereco_id"));

    return (
      <form onSubmit={formGeral.handleSubmit(onSubmitGeral)} className="flex flex-col h-full">
        <div className="flex-1 space-y-4">
          {/* Meio de Pagamento */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Meio de Pagamento
            </Label>
            <Select
              value={meioPagamentoSelecionado?.toString() || ""}
              onValueChange={(value) => formGeral.setValue("meio_pagamento_id", value ? parseInt(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o meio de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {meiosPagamento.map((meio) => (
                  <SelectItem key={meio.id} value={meio.id.toString()}>
                    {meio.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Endereço de Entrega
            </Label>
            <div className="flex gap-2">
              <Select
                value={formGeral.watch("endereco_id")?.toString() || ""}
                onValueChange={(value) => formGeral.setValue("endereco_id", value ? parseInt(value) : undefined)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione o endereço" />
                </SelectTrigger>
                <SelectContent>
                  {enderecos.map((endereco) => (
                    <SelectItem key={endereco.id} value={endereco.id.toString()}>
                      <div className="text-left">
                        <div className="font-medium">{endereco.logradouro}, {endereco.numero}</div>
                        <div className="text-xs text-gray-500">{endereco.bairro} - {endereco.cidade}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEnderecoModal(true)}
                className="px-3"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {enderecoSelecionado && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded border">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{enderecoSelecionado.logradouro}, {enderecoSelecionado.numero}</div>
                    <div>{enderecoSelecionado.bairro} - {enderecoSelecionado.cidade}/{enderecoSelecionado.estado}</div>
                    {enderecoSelecionado.ponto_referencia && (
                      <div className="text-gray-500">Ref: {enderecoSelecionado.ponto_referencia}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cupom */}
          <div className="space-y-2">
            <Label htmlFor="cupom_id" className="text-sm font-medium text-gray-700">
              Cupom de Desconto
            </Label>
            <Input
              id="cupom_id"
              type="number"
              {...formGeral.register("cupom_id", {
                setValueAs: (value) => value === "" || value === null ? undefined : Number(value)
              })}
              placeholder="ID do cupom (opcional)"
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Observação Geral */}
          <div className="space-y-2">
            <Label htmlFor="observacao_geral" className="text-sm font-medium text-gray-700">
              Observação Geral
            </Label>
            <Textarea
              id="observacao_geral"
              {...formGeral.register("observacao_geral")}
              placeholder="Observações gerais sobre o pedido..."
              className="min-h-[80px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Troco Para - só aparece se for DINHEIRO */}
          {isDinheiro && (
            <div className="space-y-2">
              <Label htmlFor="troco_para" className="text-sm font-medium text-gray-700">
                Troco Para (R$)
              </Label>
              <Input
                id="troco_para"
                type="number"
                step="0.01"
                {...formGeral.register("troco_para", { valueAsNumber: true })}
                placeholder="0.00"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Informações do Pedido */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1 border-b border-blue-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">Pedido:</span>
                <span className="text-sm font-semibold text-gray-800">#{pedido.id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-blue-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">Cliente:</span>
                <span className="text-sm font-semibold text-gray-800">{pedido.cliente_nome}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-blue-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">Pagamento:</span>
                <span className="text-sm font-semibold text-gray-800">{pedido.meio_pagamento_nome}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-medium text-gray-600">Total:</span>
                <span className="text-lg font-bold text-emerald-600">
                  R$ {pedido.valor_total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-gray-300 hover:bg-gray-50 cursor-pointer">
            Fechar
          </Button>
          <Button type="submit" disabled={loadingGeral} className="flex-1 cursor-pointer">
            {loadingGeral ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Salvando...
              </>
            ) : (
              "Salvar Dados Gerais"
            )}
          </Button>
        </div>
      </form>
    );
  };

  // Renderiza tab de itens
  const renderItens = () => {
    if (!pedido) return null;

    return (
      <form onSubmit={formItens.handleSubmit(onSubmitItens)} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Itens do Pedido */}
          <div>
            <Label className="text-lg font-semibold">Itens do Pedido</Label>
            <div className="mt-3 space-y-3">
              {itensWatch.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`border rounded-lg p-4 ${
                    item.acao === "REMOVER"
                      ? "bg-red-50 border-red-200 opacity-60"
                      : item.acao === "EDITAR"
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">
                        {pedido.itens.find(p => p.id === item.id)?.produto_descricao_snapshot ||
                         `Produto: ${item.produto_cod_barras}`}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Código: {item.produto_cod_barras}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.acao !== "REMOVER" ? (
                        <>
                          {/* Controle de Quantidade */}
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => atualizarQuantidade(index, item.quantidade - 1)}
                              disabled={item.quantidade <= 1}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantidade}
                              onChange={(e) => atualizarQuantidade(index, parseInt(e.target.value) || 1)}
                              className="w-16 h-8 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => atualizarQuantidade(index, item.quantidade + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Botão Remover */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerItem(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        /* Item removido - mostrar botão restaurar */
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => restaurarItem(index)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          Restaurar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Observação do Item */}
                  {item.acao !== "REMOVER" && (
                    <div className="mt-3">
                      <Input
                        placeholder="Observação do item..."
                        value={item.observacao || ""}
                        onChange={(e) => atualizarObservacao(index, e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 gap-2 flex">
          <Button type="button" variant="outline" onClick={handleClose} className="flex-1 cursor-pointer">
            Fechar
          </Button>
          <Button type="submit" disabled={loadingItens} className="flex-1 cursor-pointer">
            {loadingItens ? (
              <>
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
                Salvando...
              </>
            ) : (
              "Salvar Itens"
            )}
          </Button>
        </div>
      </form>
    );
  };

  if (!pedido) return null;

  // Modal simples para informar sobre edição de endereços
  const renderEnderecoModal = () => (
    <Dialog open={showEnderecoModal} onOpenChange={setShowEnderecoModal}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Editar Endereços
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            Para editar, adicionar ou remover endereços, acesse a seção de endereços no seu perfil.
          </p>
          <p className="text-xs text-gray-500">
            Após fazer as alterações, retorne aqui e selecione o endereço desejado na lista.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEnderecoModal(false)}
            className="flex-1"
          >
            Fechar
          </Button>
          <Button
            onClick={() => {
              // TODO: Navegar para página de endereços
              setShowEnderecoModal(false);
            }}
            className="flex-1"
          >
            Ir para Endereços
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const tabItems = [
    {
      value: "geral",
      label: "Dados Gerais",
      Component: renderDadosGerais,
    },
    {
      value: "itens",
      label: "Itens do Pedido",
      Component: renderItens,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[100vh] w-113 overflow-hidden flex flex-col gap-4 p-5">
        <DialogHeader className="text-center border-b pt-6 pb-6">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Editar Pedido #{pedido.id}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin mr-2" />
            Processando...
          </div>
        ) : (
          <Tabs
            items={tabItems}
            defaultValue="geral"
            containerClassName="flex-1 border-none"
            contentClassName="p-0 border-none bg-transparent"
          />
        )}
        {renderEnderecoModal()}
      </DialogContent>
    </Dialog>
  );
}