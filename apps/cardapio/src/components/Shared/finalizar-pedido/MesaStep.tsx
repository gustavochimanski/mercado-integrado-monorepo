"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";

interface MesaStepProps {
  mesaId: number | null;
  onSelect: (mesaId: number | null) => void;
}

export default function MesaStep({ mesaId, onSelect }: MesaStepProps) {
  const [numeroMesa, setNumeroMesa] = useState<string>(mesaId ? mesaId.toString() : "");

  // Se mesaId vier da URL, já preenche o input
  useEffect(() => {
    if (mesaId && mesaId.toString() !== numeroMesa) {
      setNumeroMesa(mesaId.toString());
      // Não precisa chamar onSelect aqui se já veio pré-selecionado
    }
  }, [mesaId]);

  const handleChange = (value: string) => {
    // Permite apenas números
    const apenasNumeros = value.replace(/\D/g, "");
    setNumeroMesa(apenasNumeros);
    
    // Se tiver número válido, atualiza o mesaId
    if (apenasNumeros) {
      const numero = parseInt(apenasNumeros, 10);
      if (!isNaN(numero) && numero > 0) {
        onSelect(numero);
      } else {
        onSelect(null); // Número inválido
      }
    } else {
      // Se o input estiver vazio, reseta o mesaId para null
      onSelect(null);
    }
  };

  return (
    <div className="space-y-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-primary/10">
          <UtensilsCrossed className="text-primary" size={48} />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Informe o número da mesa</h2>
          <p className="text-sm text-muted-foreground">
            Digite o número da mesa onde você está
          </p>
        </div>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <Label htmlFor="numero-mesa" className="text-base font-medium">
          Número da Mesa
        </Label>
        <Input
          id="numero-mesa"
          type="text"
          inputMode="numeric"
          placeholder="Ex: 1, 2, 3..."
          value={numeroMesa}
          onChange={(e) => handleChange(e.target.value)}
          className="text-center text-2xl font-bold h-16"
          autoFocus
        />
        {numeroMesa && (
          <p className="text-sm text-muted-foreground text-center">
            Mesa {numeroMesa} selecionada
          </p>
        )}
      </div>
    </div>
  );
}

