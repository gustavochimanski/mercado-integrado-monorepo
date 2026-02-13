"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";

interface ComplementoSectionProps {
  complemento: ComplementoResponse; // Complemento com valores da vinculação (obrigatorio, quantitativo, minimo_itens, maximo_itens, ordem)
  selecoes: Record<number, number>;
  getQuantidade: (adicionalId: number) => number;
  /**
   * Quantidade atual do item (produto/combo/receita).
   * Usado apenas para exibir os totais (ex.: 1 por unidade × 2 unidades = 2x).
   */
  quantidadeItem?: number;
  onToggle: (adicionalId: number) => void;
  onIncrement: (adicionalId: number) => void;
  onDecrement: (adicionalId: number) => void;
  highlight?: boolean;
}

/**
 * Componente para exibir e gerenciar a seleção de um complemento
 * 
 * IMPORTANTE: **TODOS** os valores de configuração (`obrigatorio`, `quantitativo`, `minimo_itens`, `maximo_itens` e `ordem`)
 * vêm da vinculação entre complemento e produto/receita/combo, não do complemento em si.
 * A API retorna esses valores quando buscamos complementos de um item específico.
 */
export function ComplementoSection({
  complemento,
  selecoes,
  getQuantidade,
  quantidadeItem = 1,
  onToggle,
  onIncrement,
  onDecrement,
  highlight = false,
}: ComplementoSectionProps) {
  // data attribute para permitir scrollIntoView do parent
  const dataAttr = { 'data-complemento-id': complemento.id };
  const totalSelecionadoPorUnidade = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
  const totalSelecionado = totalSelecionadoPorUnidade * Math.max(1, quantidadeItem);
  // minimo_itens e maximo_itens vêm da vinculação
  // Regras de mínimo/máximo são por UNIDADE do item (a seleção é aplicada igualmente a cada unidade).
  const atingiuMinimo = complemento.minimo_itens ? totalSelecionadoPorUnidade >= complemento.minimo_itens : true;
  const atingiuMaximo = complemento.maximo_itens ? totalSelecionadoPorUnidade >= complemento.maximo_itens : false;
  const faltaItens = complemento.minimo_itens ? complemento.minimo_itens - totalSelecionadoPorUnidade : 0;

  return (
    <div 
      className={`space-y-3 p-4 rounded-lg border-2 bg-card transition-all duration-300 ${
        highlight 
          ? "border-primary/60 shadow-md shadow-primary/20" 
          : ""
      }`}
      {...dataAttr}
      style={highlight ? {
        animation: 'flash 0.4s ease-in-out 5'
      } : undefined}
    >
      {/* Cabeçalho do Complemento */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-base font-semibold">{complemento.nome}</Label>
          {complemento.obrigatorio && (
            <Badge variant="destructive" className="text-xs px-2 py-0.5 font-semibold">
              <span className="mr-1">⚠️</span>
              Obrigatório
            </Badge>
          )}
          {!complemento.quantitativo && !complemento.permite_multipla_escolha && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              Escolha única
            </Badge>
          )}
          {complemento.quantitativo && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Quantitativo
            </Badge>
          )}
        </div>
        
        {complemento.descricao && (
          <p className="text-sm text-muted-foreground">{complemento.descricao}</p>
        )}

        {/* Indicadores de quantidade mínima/máxima */}
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {complemento.minimo_itens && complemento.minimo_itens > 0 && (
            <div className={`flex items-center gap-1 ${atingiuMinimo ? 'text-green-600' : 'text-orange-600'}`}>
              <span className="font-semibold">Mínimo (por unidade):</span>
              <span>{complemento.minimo_itens}</span>
              {!atingiuMinimo && (
                <span className="text-orange-600 font-semibold">
                  (faltam {faltaItens})
                </span>
              )}
            </div>
          )}
          {complemento.maximo_itens && complemento.maximo_itens > 0 && (
            <div className={`flex items-center gap-1 ${atingiuMaximo ? 'text-red-600' : 'text-muted-foreground'}`}>
              <span className="font-semibold">Máximo (por unidade):</span>
              <span>{complemento.maximo_itens}</span>
              {atingiuMaximo && (
                <span className="text-red-600 font-semibold ml-1">(limite atingido)</span>
              )}
            </div>
          )}
          {totalSelecionadoPorUnidade > 0 && (
            <div className="ml-auto text-muted-foreground">
              <span className="font-semibold">Selecionado (por unidade):</span>{" "}
              {totalSelecionadoPorUnidade}
              {quantidadeItem > 1 && (
                <span className="ml-1 text-muted-foreground/70">(total: {totalSelecionado})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Adicionais - Scroll Horizontal */}
      <div className="relative">
        <div className="relative flex overflow-x-auto gap-3 px-2 py-2 hide-scrollbar">
          {complemento.adicionais.map((adicional) => (
            <AdicionalItem
              key={adicional.id}
              adicional={adicional}
              quantidade={getQuantidade(adicional.id)}
              quantidadeItem={quantidadeItem}
              permiteMultipla={complemento.permite_multipla_escolha}
              quantitativo={complemento.quantitativo}
              atingiuMaximo={atingiuMaximo}
              onToggle={() => onToggle(adicional.id)}
              onIncrement={() => onIncrement(adicional.id)}
              onDecrement={() => onDecrement(adicional.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface AdicionalItemProps {
  adicional: AdicionalComplemento;
  quantidade: number;
  quantidadeItem: number;
  permiteMultipla: boolean;
  quantitativo: boolean;
  atingiuMaximo: boolean;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function AdicionalItem({
  adicional,
  quantidade,
  quantidadeItem,
  permiteMultipla,
  quantitativo,
  atingiuMaximo,
  onToggle,
  onIncrement,
  onDecrement,
}: AdicionalItemProps) {
  const isSelected = quantidade > 0;
  const podeIncrementar = !atingiuMaximo || quantidade === 0;
  const [imageError, setImageError] = useState(false);
  const multiplicador = Math.max(1, quantidadeItem);
  const quantidadePorUnidade = quantidade;
  const quantidadeTotal = quantidadePorUnidade * multiplicador;
  const precoPorUnidadeSelecionado = adicional.preco * quantidadePorUnidade;
  const precoTotalSelecionado = adicional.preco * quantidadeTotal;

  return (
    <div
      className={`flex flex-col items-center w-24 min-w-[96px] p-2 rounded-lg transition-all ${
        quantitativo ? "" : "cursor-pointer"
      } ${
        isSelected
          ? "bg-primary/10 shadow-sm"
          : "hover:bg-muted/50"
      }`}
      onClick={!quantitativo && !permiteMultipla ? onToggle : undefined}
    >
      {/* Imagem do adicional (se disponível) */}
      {adicional.imagem && !imageError ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-muted mb-1.5">
          <Image
            src={adicional.imagem}
            alt={adicional.nome}
            fill
            className="object-cover"
            sizes="48px"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg bg-muted mb-1.5 flex items-center justify-center">
          <span className="text-xl">🍽️</span>
        </div>
      )}

      {/* Nome do adicional */}
      <div className="w-full text-center mb-1.5">
        <Label className={`text-xs font-medium block ${!permiteMultipla ? "cursor-pointer" : ""} line-clamp-2`}>
          {adicional.nome}
        </Label>
        {adicional.descricao && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {adicional.descricao}
          </p>
        )}
      </div>

      {/* Controles de seleção/quantidade */}
      <div className="w-full flex flex-col items-center gap-1.5">
        {quantitativo ? (
          // Controles de quantidade para complementos quantitativos (sempre usar soma)
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={quantidade === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-bold w-5 text-center text-foreground">
              {quantidadePorUnidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                if (podeIncrementar) {
                  onIncrement();
                }
              }}
              disabled={!podeIncrementar}
              title={atingiuMaximo && quantidade > 0 ? "Limite máximo atingido" : ""}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : !permiteMultipla ? (
          // Radio button para escolha única (não quantitativo e não permite múltipla escolha)
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all ${
              isSelected
                ? "border-primary bg-primary shadow-sm"
                : "border-muted-foreground/50 hover:border-primary/70"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
            )}
          </div>
        ) : (
          // Controles de quantidade para múltipla escolha (não quantitativo mas permite múltipla escolha)
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={quantidade === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-xs font-bold w-5 text-center text-foreground">
              {quantidadePorUnidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                if (podeIncrementar) {
                  onIncrement();
                }
              }}
              disabled={!podeIncrementar}
              title={atingiuMaximo && quantidade > 0 ? "Limite máximo atingido" : ""}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Preço */}
        <div className="w-full text-center">
          {adicional.preco > 0 ? (
            <div>
              {quantidade > 0 && quantitativo ? (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-primary">
                    R$ {(multiplicador > 1 ? precoTotalSelecionado : precoPorUnidadeSelecionado)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {quantidadePorUnidade}x R$ {adicional.preco.toFixed(2).replace(".", ",")} por unidade
                    {multiplicador > 1 && <span className="ml-1">(total: {quantidadeTotal}x)</span>}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-primary">
                    + R$ {adicional.preco.toFixed(2).replace(".", ",")}
                    {multiplicador > 1 && <span className="text-muted-foreground"> / un.</span>}
                  </span>
                  {multiplicador > 1 && quantidadePorUnidade > 0 && (
                    <span className="text-xs text-muted-foreground">
                      Total: + R$ {precoTotalSelecionado.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground italic">Grátis</span>
          )}
        </div>
      </div>
    </div>
  );
}

