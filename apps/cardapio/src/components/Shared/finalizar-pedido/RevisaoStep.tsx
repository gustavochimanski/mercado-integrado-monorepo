"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import { ChevronDown, Trash2 } from "lucide-react";

interface Item {
  cod_barras: string;
  nome: string;
  quantity: number;
  preco: number;
}

interface PreviewCheckoutData {
  subtotal: number;
  taxa_entrega: number;
  taxa_servico: number;
  valor_total: number;
  desconto: number;
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
  previewData?: PreviewCheckoutData | null;
  isLoadingPreview?: boolean;
  inc?: (cod_barras: string) => void;
  dec?: (cod_barras: string) => void;
  remove?: (cod_barras: string) => void;
  tipoPedido?: "DELIVERY" | "MESA" | "BALCAO" | null;
  mesaCodigo?: string | null;
  numPessoas?: number | null;
}

export default function RevisaoStep({
  items,
  observacao,
  endereco,
  pagamento,
  trocoPara,
  total,
  previewData,
  isLoadingPreview = false,
  inc,
  dec,
  remove,
  tipoPedido,
  mesaCodigo,
  numPessoas,
}: RevisaoStepProps) {
  // Estado para controlar a seta
  const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    // Desaparece após 6 segundos
    const timer = setTimeout(() => setShowArrow(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4 relative">
      <h2 className="text-xl font-bold text-center">Revisão do Pedido</h2>

      {/* Tipo de Pedido e Info Correspondente */}
      {tipoPedido === "MESA" && mesaCodigo && (
        <Card className="gap-0 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Mesa Selecionada</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-600">Mesa {mesaCodigo}</span>
            </div>
            {numPessoas && (
              <p className="text-xs text-muted-foreground mt-1">
                Número de pessoas informado: <strong>{numPessoas}</strong>
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Seu atendimento será realizado nesta mesa
            </p>
          </CardContent>
        </Card>
      )}
      
      {tipoPedido === "BALCAO" && (
        <Card className="gap-0 border-green-200">
          <CardHeader>
            <CardTitle className="text-base">Tipo de Pedido</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-green-600">Retirada no Balcão</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Você receberá uma notificação quando o pedido estiver pronto para retirada
            </p>
            {mesaCodigo && (
              <p className="text-xs text-muted-foreground mt-1">
                Código de referência informado: <strong>{mesaCodigo}</strong>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Endereço - apenas para delivery */}
      {tipoPedido === "DELIVERY" && (
        <Card className="gap-0">
          <CardHeader>
            <CardTitle className="text-base">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            {endereco
              ? `${endereco.logradouro || ""}${
                  endereco.numero ? `, ${endereco.numero}` : ""
                }${endereco.bairro ? ` - ${endereco.bairro}` : ""}${
                  endereco.cidade ? ` (${endereco.cidade})` : ""
                }`
              : "Não informado"}
          </CardContent>
        </Card>
      )}

      {/* Pagamento */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-1">
          <div>{pagamento?.nome || "Não informado"}</div>
          {pagamento?.tipo === "DINHEIRO" && trocoPara && (
            <div className="text-muted-foreground">
              Troco para: <strong className="text-gray-700">R$ {trocoPara.toFixed(2)}</strong>
            </div>
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

      {/* Breakdown de valores */}
      <Card className="gap-0">
        <CardHeader>
          <CardTitle className="text-base">Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoadingPreview ? (
            <div className="text-sm text-muted-foreground">Calculando valores...</div>
          ) : previewData ? (
            <>
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>R$ {previewData.subtotal.toFixed(2)}</span>
              </div>
              {previewData.desconto > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Desconto</span>
                  <span>- R$ {previewData.desconto.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Taxa de entrega</span>
                <span className="font-medium">R$ {previewData.taxa_entrega.toFixed(2)}</span>
              </div>
              {previewData.taxa_servico > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Taxa de serviço</span>
                  <span>R$ {previewData.taxa_servico.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">R$ {previewData.valor_total.toFixed(2)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>Será calculada</span>
              </div>
              <div className="pt-2 border-t flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-green-600">R$ {total.toFixed(2)}</span>
              </div>
            </>
          )}
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
