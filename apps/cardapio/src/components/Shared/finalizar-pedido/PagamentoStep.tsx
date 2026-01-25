"use client";

import { useState, useEffect } from "react";
import type { MeioPagamento } from "@cardapio/services/meio-pagamento";
import { Banknote, CreditCard, QrCode, Smartphone, type LucideIcon, Plus } from "lucide-react";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Button } from "@cardapio/components/Shared/ui/button";
import ModalCombinarPagamentos, { type MeioPagamentoSelecionado } from "./ModalCombinarPagamentos";

// Mapeamento de ícones por tipo
const ICONES_PAGAMENTO: Record<string, LucideIcon> = {
  DINHEIRO: Banknote,
  CARTAO_ENTREGA: CreditCard,
  CARTAO_ONLINE: CreditCard,
  PIX_ENTREGA: QrCode,
  PIX_ONLINE: Smartphone,
};

interface PagamentoStepProps {
  meios: MeioPagamento[];
  selecionado: number | null;
  onSelect: (id: number) => void;
  onTrocoChange?: (valor: number | null) => void;
  onMeiosMultiplosChange?: (meios: MeioPagamentoSelecionado[], trocoPara?: number) => void;
  meiosMultiplos?: MeioPagamentoSelecionado[];
  valorTotal?: number;
}

export default function PagamentoStep({ 
  meios, 
  selecionado, 
  onSelect, 
  onTrocoChange,
  onMeiosMultiplosChange,
  meiosMultiplos = [],
  valorTotal = 0,
}: PagamentoStepProps) {
  const [selected, setSelected] = useState<number | null>(selecionado ?? null);
  const [trocoPara, setTrocoPara] = useState<string>("");
  const [showModalCombinar, setShowModalCombinar] = useState(false);
  const [usandoMultiplosPagamentos, setUsandoMultiplosPagamentos] = useState(meiosMultiplos.length > 0);

  useEffect(() => setSelected(selecionado ?? null), [selecionado]);
  useEffect(() => {
    setUsandoMultiplosPagamentos(meiosMultiplos.length > 0);
    if (meiosMultiplos.length > 0) {
      setSelected(null);
    }
  }, [meiosMultiplos]);

  const meioSelecionado = meios.find(m => m.id === selected);
  const mostrarCampoTroco = meioSelecionado?.tipo === "DINHEIRO" && !usandoMultiplosPagamentos;

  const handleTrocoChange = (value: string) => {
    setTrocoPara(value);
    const valorNumerico = value ? parseFloat(value) : null;
    onTrocoChange?.(valorNumerico);
  };

  const handleConfirmarMultiplos = (meiosConfirmados: MeioPagamentoSelecionado[], trocoParaMultiplo?: number) => {
    onMeiosMultiplosChange?.(meiosConfirmados, trocoParaMultiplo);
    setUsandoMultiplosPagamentos(meiosConfirmados.length > 0);
    if (meiosConfirmados.length > 0) {
      setSelected(null);
      setTrocoPara("");
    }
  };

  const handleSelecionarMeio = (id: number) => {
    if (usandoMultiplosPagamentos) {
      // Se estava usando múltiplos, limpar e voltar para seleção única
      onMeiosMultiplosChange?.([]);
      setUsandoMultiplosPagamentos(false);
    }
    setSelected(id);
    onSelect(id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      
      {meios.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum meio de pagamento disponível</p>
        </div>
      )}

      {usandoMultiplosPagamentos && meiosMultiplos.length > 0 && (
        <div className="p-4 bg-primary/5 border-2 border-primary rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-primary">Pagamentos combinados:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onMeiosMultiplosChange?.([]);
                setUsandoMultiplosPagamentos(false);
              }}
              className="h-6 text-xs"
            >
              Limpar
            </Button>
          </div>
          <div className="space-y-1">
            {meiosMultiplos.map((meio, index) => {
              const Icon = ICONES_PAGAMENTO[meio.tipo] || Banknote;
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="text-primary" size={16} />
                    <span>{meio.nome}</span>
                  </div>
                  <span className="font-medium">R$ {meio.valor.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="pt-2 border-t border-primary/20 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-primary">
                R$ {meiosMultiplos.reduce((acc, m) => acc + m.valor, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {!usandoMultiplosPagamentos && (
        <>
          <div className="grid gap-3" role="radiogroup" aria-label="Selecione uma forma de pagamento">
            {meios.map((m: MeioPagamento) => {
              const isSelected = selected === m.id;
              const Icon = ICONES_PAGAMENTO[m.tipo] || Banknote;

              return (
                <div
                  key={m.id}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Selecionar ${m.nome} como forma de pagamento`}
                  tabIndex={0}
                  onClick={() => handleSelecionarMeio(m.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelecionarMeio(m.id);
                    }
                  }}
                  className={`relative rounded-xl p-3 sm:p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${isSelected ? "border-2 border-primary bg-primary/5" : "border border-muted-foreground/20 hover:border-primary/50"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={isSelected ? "text-primary" : "text-muted-foreground"}
                      size={24}
                    />
                    <span className="font-medium">{m.nome}</span>
                  </div>

                  {isSelected && (
                    <span className="absolute top-1/2 -translate-y-1/2 right-3 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                      Selecionado
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Campo de troco para pagamento em dinheiro */}
          {mostrarCampoTroco && (
            <div className="space-y-2 p-4 bg-muted/50 rounded-xl">
              <Label htmlFor="troco-para" className="text-sm font-medium">
                Troco para quanto? <span className="text-red-600">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">R$</span>
                <Input
                  id="troco-para"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 50.00"
                  value={trocoPara}
                  onChange={(e) => handleTrocoChange(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Informe o valor da nota para facilitar o troco (obrigatório)
              </p>
            </div>
          )}
        </>
      )}

      {/* Botão Combinar Pagamentos */}
      <Button
        variant="outline"
        onClick={() => setShowModalCombinar(true)}
        className="w-full"
      >
        <Plus size={16} className="mr-2" />
        Combinar pagamentos
      </Button>

      <ModalCombinarPagamentos
        open={showModalCombinar}
        onClose={() => setShowModalCombinar(false)}
        onConfirm={handleConfirmarMultiplos}
        meiosDisponiveis={meios}
        valorTotal={valorTotal}
        meiosIniciais={meiosMultiplos}
      />
    </div>
  );
}
