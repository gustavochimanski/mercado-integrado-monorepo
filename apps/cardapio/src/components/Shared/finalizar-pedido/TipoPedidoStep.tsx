"use client";

import { useState } from "react";
import { Home, Store, UtensilsCrossed } from "lucide-react";

export type TipoPedido = "DELIVERY" | "MESA" | "BALCAO" | null;

interface TipoPedidoStepProps {
  tipoSelecionado: TipoPedido;
  onSelect: (tipo: TipoPedido) => void;
}

export default function TipoPedidoStep({ tipoSelecionado, onSelect }: TipoPedidoStepProps) {
  const [selected, setSelected] = useState<TipoPedido>(tipoSelecionado ?? null);

  const tipos = [
    {
      value: "MESA" as TipoPedido,
      label: "Mesa",
      description: "Atendimento no restaurante",
      icon: UtensilsCrossed,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
    },
    {
      value: "BALCAO" as TipoPedido,
      label: "Balcão",
      description: "Retirada no balcão",
      icon: Store,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
    },
    {
      value: "DELIVERY" as TipoPedido,
      label: "Delivery",
      description: "Entrega em casa",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
    },
  ];

  const handleSelect = (tipo: TipoPedido) => {
    setSelected(tipo);
    onSelect(tipo);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Como deseja receber seu pedido?</h2>
        <p className="text-sm text-muted-foreground">Escolha o tipo de atendimento</p>
      </div>

      <div className="grid gap-3">
        {tipos.map((tipo) => {
          const isSelected = selected === tipo.value;
          const Icon = tipo.icon;

          return (
            <div
              key={tipo.value}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(tipo.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(tipo.value);
                }
              }}
              className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all
                ${
                  isSelected
                    ? `${tipo.borderColor} ${tipo.bgColor} ring-2 ring-offset-2 ${tipo.borderColor}`
                    : "border-muted hover:border-primary/50 hover:bg-muted/30"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${isSelected ? tipo.bgColor : "bg-muted"}`}>
                  <Icon
                    className={isSelected ? tipo.color : "text-muted-foreground"}
                    size={28}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{tipo.label}</h3>
                  <p className="text-sm text-muted-foreground">{tipo.description}</p>
                </div>
              </div>

              {isSelected && (
                <span className="absolute top-3 right-3 text-xs bg-primary text-white px-2 py-1 rounded-full font-medium">
                  Selecionado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

