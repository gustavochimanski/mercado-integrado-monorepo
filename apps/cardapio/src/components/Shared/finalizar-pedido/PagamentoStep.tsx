"use client";

import { useState, useEffect } from "react";
import type { MeioPagamento } from "@cardapio/services/useQueryMeioPagamento";
import { Banknote, CreditCard, QrCode, Smartphone, type LucideIcon } from "lucide-react";
import { Label } from "@cardapio/components/Shared/ui/label";
import { Input } from "@cardapio/components/Shared/ui/input";

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
}

export default function PagamentoStep({ meios, selecionado, onSelect, onTrocoChange }: PagamentoStepProps) {
  const [selected, setSelected] = useState<number | null>(selecionado ?? null);
  const [trocoPara, setTrocoPara] = useState<string>("");

  useEffect(() => setSelected(selecionado ?? null), [selecionado]);

  const meioSelecionado = meios.find(m => m.id === selected);
  const mostrarCampoTroco = meioSelecionado?.tipo === "DINHEIRO";

  const handleTrocoChange = (value: string) => {
    setTrocoPara(value);
    const valorNumerico = value ? parseFloat(value) : null;
    onTrocoChange?.(valorNumerico);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      
      {meios.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum meio de pagamento disponível</p>
        </div>
      )}

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
              onClick={() => {
                setSelected(m.id);
                onSelect(m.id);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelected(m.id);
                  onSelect(m.id);
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
            Troco para quanto? (Opcional)
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
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Informe o valor da nota para facilitar o troco
          </p>
        </div>
      )}
    </div>
  );
}
