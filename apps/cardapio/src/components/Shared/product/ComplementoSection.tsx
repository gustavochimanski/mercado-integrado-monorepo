"use client";

import Image from "next/image";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Minus, Plus, Check } from "lucide-react";
import type { ComplementoResponse, AdicionalComplementoResponse as AdicionalComplemento } from "@cardapio/types/complementos";

interface ComplementoSectionProps {
  complemento: ComplementoResponse;
  selecoes: Record<number, number>;
  getQuantidade: (adicionalId: number) => number;
  onToggle: (adicionalId: number) => void;
  onIncrement: (adicionalId: number) => void;
  onDecrement: (adicionalId: number) => void;
}

export function ComplementoSection({
  complemento,
  selecoes,
  getQuantidade,
  onToggle,
  onIncrement,
  onDecrement,
}: ComplementoSectionProps) {
  const totalSelecionado = Object.values(selecoes).reduce((sum, qtd) => sum + qtd, 0);
  const atingiuMinimo = complemento.minimo_itens ? totalSelecionado >= complemento.minimo_itens : true;
  const atingiuMaximo = complemento.maximo_itens ? totalSelecionado >= complemento.maximo_itens : false;
  const faltaItens = complemento.minimo_itens ? complemento.minimo_itens - totalSelecionado : 0;

  return (
    <div className="space-y-3 p-4 rounded-lg border-2 bg-card">
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
              <span className="font-semibold">Mínimo:</span>
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
              <span className="font-semibold">Máximo:</span>
              <span>{complemento.maximo_itens}</span>
              {atingiuMaximo && (
                <span className="text-red-600 font-semibold ml-1">(limite atingido)</span>
              )}
            </div>
          )}
          {totalSelecionado > 0 && (
            <div className="ml-auto text-muted-foreground">
              <span className="font-semibold">Selecionado:</span> {totalSelecionado}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Adicionais */}
      <div className="space-y-2">
        {complemento.adicionais.map((adicional) => (
          <AdicionalItem
            key={adicional.id}
            adicional={adicional}
            quantidade={getQuantidade(adicional.id)}
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
  );
}

interface AdicionalItemProps {
  adicional: AdicionalComplemento;
  quantidade: number;
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
  permiteMultipla,
  quantitativo,
  atingiuMaximo,
  onToggle,
  onIncrement,
  onDecrement,
}: AdicionalItemProps) {
  const isSelected = quantidade > 0;
  const podeIncrementar = !atingiuMaximo || quantidade === 0;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
        quantitativo ? "" : "cursor-pointer"
      } ${
        isSelected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border hover:border-primary/50 bg-background hover:bg-muted/50"
      }`}
      onClick={!quantitativo && !permiteMultipla ? onToggle : undefined}
    >
      <div className="flex items-center gap-3 flex-1">
        {quantitativo ? (
          // Controles de quantidade para complementos quantitativos (sempre usar soma)
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={quantidade === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base font-bold w-8 text-center text-foreground">
              {quantidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                if (podeIncrementar) {
                  onIncrement();
                }
              }}
              disabled={!podeIncrementar}
              title={atingiuMaximo && quantidade > 0 ? "Limite máximo atingido" : ""}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : !permiteMultipla ? (
          // Radio button para escolha única (não quantitativo e não permite múltipla escolha)
          <div
            className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
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
              <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
            )}
          </div>
        ) : (
          // Controles de quantidade para múltipla escolha (não quantitativo mas permite múltipla escolha)
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement();
              }}
              disabled={quantidade === 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-base font-bold w-8 text-center text-foreground">
              {quantidade}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-background disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                if (podeIncrementar) {
                  onIncrement();
                }
              }}
              disabled={!podeIncrementar}
              title={atingiuMaximo && quantidade > 0 ? "Limite máximo atingido" : ""}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
        {/* Imagem do adicional (se disponível) */}
        {adicional.imagem && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={adicional.imagem}
              alt={adicional.nome}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Label className={`text-sm font-medium block ${!permiteMultipla ? "cursor-pointer" : ""}`}>
            {adicional.nome}
          </Label>
          {adicional.descricao && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {adicional.descricao}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-2">
        {adicional.preco > 0 && (
          <div className="text-right">
            {quantidade > 0 && quantitativo ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-primary">
                  R$ {(adicional.preco * quantidade).toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {quantidade}x R$ {adicional.preco.toFixed(2).replace(".", ",")}
                </span>
              </div>
            ) : (
              <span className="text-sm font-semibold text-primary">
                + R$ {adicional.preco.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
        )}
        {adicional.preco === 0 && (
          <span className="text-xs text-muted-foreground italic">Grátis</span>
        )}
      </div>
    </div>
  );
}

