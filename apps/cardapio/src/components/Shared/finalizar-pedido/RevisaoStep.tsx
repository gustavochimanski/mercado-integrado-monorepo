"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Badge } from "@cardapio/components/Shared/ui/badge";
import { AlertCircle, Check, ChevronDown, Copy, Loader2, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PagamentoStatusEnum } from "@cardapio/api/models/PagamentoStatusEnum";
import type { TransacaoOut } from "@cardapio/api/models/TransacaoOut";

const FINAL_STATUSES = new Set<PagamentoStatusEnum>([
  PagamentoStatusEnum.PAGO,
  PagamentoStatusEnum.AUTORIZADO,
  PagamentoStatusEnum.CANCELADO,
  PagamentoStatusEnum.ESTORNADO,
  PagamentoStatusEnum.RECUSADO,
]);

interface Item {
  cod_barras: string;
  nome: string;
  quantity: number;
  preco: number;
}

interface RevisaoStepProps {
  items: Item[];
  observacao?: string;
  endereco?: {
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
  };
  pagamento?: {
    nome?: string;
    tipo?: string;
  };
  trocoPara?: number | null;
  total: number;
  inc?: (cod_barras: string) => void;
  dec?: (cod_barras: string) => void;
  remove?: (cod_barras: string) => void;
  transacao?: TransacaoOut | null;
  statusPagamento?: PagamentoStatusEnum | null;
  onAtualizarStatus?: () => void;
  atualizandoStatus?: boolean;
  erroStatus?: string | null;
  isPolling?: boolean;
  onGerarPix?: () => void;
  gerandoPix?: boolean;
  erroGerarPix?: string | null;
  podeGerarPix?: boolean;
}

export default function RevisaoStep({
  items,
  observacao,
  endereco,
  pagamento,
  trocoPara,
  total,
  inc,
  dec,
  remove,
  transacao,
  statusPagamento,
  atualizandoStatus,
  erroStatus,
  isPolling,
  onAtualizarStatus,
  onGerarPix,
  gerandoPix,
  erroGerarPix,
  podeGerarPix,
}: RevisaoStepProps) {
  // Estado para controlar a seta
  const [showArrow, setShowArrow] = useState(true);

  const enderecoFormatado = useMemo(() => {
    if (!endereco) return "Não informado";
    const partes = [
      endereco.logradouro,
      endereco.numero,
      endereco.bairro ? `- ${endereco.bairro}` : undefined,
      endereco.cidade ? `(${endereco.cidade})` : undefined,
    ].filter(Boolean);
    return partes.join(" ") || "Não informado";
  }, [endereco]);

  useEffect(() => {
    // Desaparece após 6 segundos
    const timer = setTimeout(() => setShowArrow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 relative">
      <h2 className="text-xl font-bold text-center">Revisão do Pedido</h2>

      {/* Endereço */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Endereço</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {enderecoFormatado}
        </CardContent>
      </Card>

      {/* Pagamento */}
      <Card className="gap-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pagamento</CardTitle>
          {statusPagamento && (
            <BadgePagamento status={statusPagamento} />
          )}
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span>{pagamento?.nome || "Não informado"}</span>
            </div>

            {pagamento?.tipo === "DINHEIRO" && trocoPara && (
              <div className="text-muted-foreground">
                Troco para: <strong className="text-gray-700">R$ {trocoPara.toFixed(2)}</strong>
              </div>
            )}
          </div>

          {pagamento?.tipo === "PIX_ONLINE" && (
            transacao ? (
              <PixPagamentoDetalhes
                transacao={transacao}
                status={statusPagamento}
                onAtualizarStatus={onAtualizarStatus}
                atualizando={atualizandoStatus}
                erro={erroStatus}
                isPolling={isPolling}
              />
            ) : (
              <PixGerarPagamento
                onGerarPix={onGerarPix}
                gerando={gerandoPix}
                erro={erroGerarPix}
                habilitado={podeGerarPix}
              />
            )
          )}
        </CardContent>
      </Card>

      {/* Observação */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Observação</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          {observacao?.trim() || "Nenhuma"}
        </CardContent>
      </Card>

      {/* Itens do pedido */}
      <Card className="gap-0">
        <CardTitle className="text-base mx-3">Itens</CardTitle>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={item.cod_barras}
                className="flex flex-col py-2 px-4 text-sm gap-2"
              >
                <span>
                  <strong>{item.quantity} x</strong> {item.nome}
                </span>

                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">
                    R$ {(item.preco * item.quantity).toFixed(2)}
                  </span>
                  {inc && dec && remove && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => dec(item.cod_barras)}
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center my-auto">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => inc(item.cod_barras)}
                      >
                        +
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(item.cod_barras)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Total */}
      <Card className="bg-gray-100 shadow-inner">
        <CardContent className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-green-600">R$ {total.toFixed(2)}</span>
        </CardContent>
      </Card>

      {/* SETA FLUTUANTE */}
      {showArrow && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-primary animate-bounce">
          <ChevronDown size={30} />
        </div>
      )}
    </div>
  );
}

interface BadgePagamentoProps {
  status: PagamentoStatusEnum;
}

function BadgePagamento({ status }: BadgePagamentoProps) {
  const config: Record<PagamentoStatusEnum, { label: string; className: string }> = {
    [PagamentoStatusEnum.PENDENTE]: {
      label: "Aguardando pagamento",
      className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    [PagamentoStatusEnum.AUTORIZADO]: {
      label: "Autorizado",
      className: "bg-sky-100 text-sky-800 border-sky-200",
    },
    [PagamentoStatusEnum.PAGO]: {
      label: "Pago",
      className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    [PagamentoStatusEnum.RECUSADO]: {
      label: "Recusado",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    [PagamentoStatusEnum.CANCELADO]: {
      label: "Cancelado",
      className: "bg-gray-200 text-gray-700 border-gray-300",
    },
    [PagamentoStatusEnum.ESTORNADO]: {
      label: "Estornado",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-gray-200 text-gray-700 border-gray-300",
  };

  return <Badge className={className}>{label}</Badge>;
}

interface PixPagamentoDetalhesProps {
  transacao: TransacaoOut;
  status?: PagamentoStatusEnum | null;
  onAtualizarStatus?: () => void;
  atualizando?: boolean;
  erro?: string | null;
  isPolling?: boolean;
}

function PixPagamentoDetalhes({ transacao, status, onAtualizarStatus, atualizando, erro, isPolling }: PixPagamentoDetalhesProps) {
  const [copiado, setCopiado] = useState(false);
  const codigoPix = transacao.qr_code ?? "";
  const ultimaAtualizacao = useMemo(() => {
    const data = transacao.updated_at || transacao.pago_em || transacao.autorizado_em;
    if (!data) return null;
    try {
      return new Date(data);
    } catch {
      return null;
    }
  }, [transacao]);

  useEffect(() => {
    if (copiado) {
      const timeout = setTimeout(() => setCopiado(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiado]);

  const handleCopiar = async () => {
    if (!codigoPix) return;
    try {
      await navigator.clipboard.writeText(codigoPix);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const podeAtualizar =
    typeof onAtualizarStatus === "function" &&
    status &&
    !FINAL_STATUSES.has(status);

  return (
    <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex items-center justify-center sm:w-48">
          {codigoPix ? (
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <QRCodeSVG value={codigoPix} size={160} includeMargin={false} />
            </div>
          ) : transacao.qr_code_base64 ? (
            <img
              src={`data:image/png;base64,${transacao.qr_code_base64}`}
              alt="QR Code PIX"
              className="w-40 rounded-lg border bg-white p-2"
            />
          ) : (
            <span className="text-xs text-muted-foreground">QR Code indisponível</span>
          )}
        </div>

        <div className="flex-1 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">PIX copia e cola</p>
              <p className="text-xs text-muted-foreground">
                Escaneie o QR Code ou use o código abaixo para pagar pelo app do seu banco
              </p>
            </div>

            {podeAtualizar && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAtualizarStatus}
                disabled={atualizando}
              >
                {atualizando ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Atualizando...
                  </span>
                ) : (
                  "Atualizar status"
                )}
              </Button>
            )}
          </div>

          <div className="rounded-lg border bg-white/80 p-3 font-mono text-xs leading-relaxed text-gray-800 break-all">
            {codigoPix || "Aguardando geração do código PIX"}
          </div>

          <Button
            type="button"
            variant={copiado ? "default" : "secondary"}
            size="sm"
            onClick={handleCopiar}
            disabled={!codigoPix}
            className="flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            {copiado ? <Check size={16} /> : <Copy size={16} />}
            {copiado ? "Código copiado" : "Copiar código"}
          </Button>

          {erro && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
              <AlertCircle className="h-4 w-4" />
              {erro}
            </div>
          )}

          <div className="space-y-1 text-xs text-muted-foreground">
            {transacao.provider_transaction_id && (
              <p>
                ID da transação: <span className="font-semibold text-gray-700">{transacao.provider_transaction_id}</span>
              </p>
            )}
            {ultimaAtualizacao && (
              <p>
                Última atualização: {ultimaAtualizacao.toLocaleString("pt-BR")}
              </p>
            )}
            {isPolling && !FINAL_STATUSES.has(status ?? PagamentoStatusEnum.PENDENTE) && (
              <p className="flex items-center gap-2 text-xs text-amber-700">
                <Loader2 className="h-3 w-3 animate-spin" /> Monitorando status com o provedor
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface PixGerarPagamentoProps {
  onGerarPix?: () => void;
  gerando?: boolean;
  erro?: string | null;
  habilitado?: boolean;
}

function PixGerarPagamento({ onGerarPix, gerando, erro, habilitado = true }: PixGerarPagamentoProps) {
  const podeGerar = typeof onGerarPix === "function" && habilitado;

  return (
    <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-900">Pagamento PIX Online</p>
        <p className="text-xs text-muted-foreground">
          Clique em gerar QR Code para iniciar o pagamento junto ao provedor.
        </p>
      </div>

      <Button
        type="button"
        onClick={onGerarPix}
        disabled={!podeGerar || gerando}
        className="flex items-center gap-2"
      >
        {gerando && <Loader2 className="h-4 w-4 animate-spin" />}
        {gerando ? "Gerando pagamento..." : podeGerar ? "Gerar QR Code" : "Aguardando requisição"}
      </Button>

      {erro && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4" />
          {erro}
        </div>
      )}
    </div>
  );
}
