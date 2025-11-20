"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@cardapio/components/Shared/ui/card";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  ChevronDown,
  Trash2,
  MapPin,
  CreditCard,
  FileText,
  Package,
  ShoppingBag,
  Clock,
  Navigation,
  Users,
  Store,
  Minus,
  Plus,
} from "lucide-react";

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
  distancia_km?: number;
  empresa_id?: number;
  tempo_entrega_minutos?: number;
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
    <div className="space-y-3 relative pb-4">
      {/* Header Minimalista */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Revisão do Pedido</h2>
        <p className="text-sm text-muted-foreground mt-1">Confira os detalhes antes de finalizar</p>
      </div>

      {/* Tipo de Pedido - Design Minimalista */}
      {tipoPedido === "MESA" && mesaCodigo && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">Mesa {mesaCodigo}</span>
                </div>
                {numPessoas && (
                  <p className="text-sm text-muted-foreground">
                    {numPessoas} {numPessoas === 1 ? "pessoa" : "pessoas"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Atendimento na mesa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {tipoPedido === "BALCAO" && (
        <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Store className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-semibold text-base block">Retirada no Balcão</span>
                <p className="text-xs text-muted-foreground">
                  Você receberá uma notificação quando estiver pronto
                </p>
                {mesaCodigo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Código: <span className="font-medium">{mesaCodigo}</span>
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Endereço - Design Minimalista */}
      {tipoPedido === "DELIVERY" && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Endereço de entrega</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {endereco
                    ? `${endereco.logradouro || ""}${
                        endereco.numero ? `, ${endereco.numero}` : ""
                      }${endereco.bairro ? ` - ${endereco.bairro}` : ""}${
                        endereco.cidade ? `, ${endereco.cidade}` : ""
                      }`
                    : "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagamento - Design Minimalista */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{pagamento?.nome || "Não informado"}</p>
              {pagamento?.tipo === "DINHEIRO" && trocoPara && (
                <p className="text-xs text-muted-foreground">
                  Troco para <span className="font-medium text-foreground">R$ {trocoPara.toFixed(2)}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observação - Design Minimalista */}
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Observação</p>
              <p className="text-sm text-muted-foreground">
                {observacao?.trim() || "Nenhuma observação"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itens do pedido - Design Melhorado */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Itens do Pedido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.cod_barras}
                className="px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {item.quantity}x
                      </span>
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item.nome}
                      </h3>
                    </div>
                    <p className="text-base font-semibold text-foreground mt-2">
                      R$ {(item.preco * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  {inc && dec && remove && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1 border rounded-lg">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => dec(item.cod_barras)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[2rem] text-center text-sm font-medium px-2">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => inc(item.cod_barras)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => remove(item.cod_barras)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro - Design Premium */}
      <Card className="bg-gradient-to-br from-background to-muted/20 border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Resumo do Pedido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingPreview ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Calculando valores...</span>
              </div>
            </div>
          ) : previewData ? (
            <>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {previewData.subtotal.toFixed(2)}</span>
                </div>
                
                {previewData.desconto > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      - R$ {previewData.desconto.toFixed(2)}
                    </span>
                  </div>
                )}
                
                {tipoPedido === "DELIVERY" && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Navigation className="h-4 w-4" />
                        <span>Taxa de entrega</span>
                      </div>
                      <span className="font-medium">R$ {previewData.taxa_entrega.toFixed(2)}</span>
                    </div>
                    
                    {previewData.distancia_km !== undefined && previewData.distancia_km !== null && (
                      <div className="flex justify-between items-center text-xs text-muted-foreground pl-6">
                        <span>Distância</span>
                        <span>{previewData.distancia_km.toFixed(2)} km</span>
                      </div>
                    )}
                    
                    {previewData.tempo_entrega_minutos !== undefined && previewData.tempo_entrega_minutos !== null && (
                      <div className="flex justify-between items-center text-xs text-muted-foreground pl-6">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Previsão</span>
                        </div>
                        <span>
                          {previewData.tempo_entrega_minutos >= 60
                            ? `${Math.floor(previewData.tempo_entrega_minutos / 60)}h ${previewData.tempo_entrega_minutos % 60}min`
                            : `${Math.round(previewData.tempo_entrega_minutos)} min`}
                        </span>
                      </div>
                    )}
                  </>
                )}
                
                {previewData.taxa_servico > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Taxa de serviço</span>
                    <span className="font-medium">R$ {previewData.taxa_servico.toFixed(2)}</span>
                  </div>
                )}
                
                {pagamento?.tipo === "DINHEIRO" && trocoPara && trocoPara > 0 && (
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Troco para</span>
                    <span>R$ {trocoPara.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {previewData.valor_total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>Será calculada</span>
              </div>
              <div className="pt-4 mt-4 border-t-2 border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Seta Flutuante - Melhorada */}
      {showArrow && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary/10 backdrop-blur-sm rounded-full p-2 animate-bounce">
            <ChevronDown className="h-5 w-5 text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
