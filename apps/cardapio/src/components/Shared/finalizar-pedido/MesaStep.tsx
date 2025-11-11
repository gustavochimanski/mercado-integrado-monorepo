"use client";

import { useState, useEffect } from "react";
import { UtensilsCrossed } from "lucide-react";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";

interface MesaStepProps {
  mesaId: number | null;
  mesaCodigo: string | null;
  numPessoas: number | null;
  onSelect: (mesaId: number | null, mesaCodigo: string | null) => void;
  onNumPessoasChange: (quantidade: number | null) => void;
}

export default function MesaStep({ mesaId, mesaCodigo, numPessoas, onSelect, onNumPessoasChange }: MesaStepProps) {
  const [numeroMesa, setNumeroMesa] = useState<string>(mesaCodigo ?? "");
  const [quantidadePessoas, setQuantidadePessoas] = useState<string>(numPessoas ? numPessoas.toString() : "");

  // Se mesaId vier da URL, já preenche o input
  useEffect(() => {
    const codigoDerivado = mesaCodigo ?? (mesaId !== null ? mesaId.toString() : "");
    if (codigoDerivado !== numeroMesa) {
      setNumeroMesa(codigoDerivado);
    }
  }, [mesaCodigo, mesaId]);

  useEffect(() => {
    const valorAtual = numPessoas ? numPessoas.toString() : "";
    if (valorAtual !== quantidadePessoas) {
      setQuantidadePessoas(valorAtual);
    }
  }, [numPessoas]);

  const handleChange = (value: string) => {
    // Permite somente números
    const apenasNumeros = value.replace(/\D/g, "");
    setNumeroMesa(apenasNumeros);

    if (apenasNumeros) {
      const numero = parseInt(apenasNumeros, 10);
      if (!isNaN(numero) && numero > 0) {
        onSelect(numero, apenasNumeros);
        return;
      }
    }

    onSelect(null, null);
  };

  const handleNumPessoasChangeInternal = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "");
    setQuantidadePessoas(apenasNumeros);

    if (apenasNumeros) {
      const numero = parseInt(apenasNumeros, 10);
      if (!isNaN(numero) && numero > 0 && numero <= 50) {
        onNumPessoasChange(numero);
      } else {
        onNumPessoasChange(null);
      }
    } else {
      onNumPessoasChange(null);
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

      <div className="space-y-4 max-w-md mx-auto">
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
        {(numeroMesa || mesaId) && (
          <p className="text-sm text-muted-foreground text-center">
            Mesa {numeroMesa || mesaId} selecionada
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="num-pessoas" className="text-base font-medium">
            Número de pessoas (opcional)
          </Label>
          <Input
            id="num-pessoas"
            type="text"
            inputMode="numeric"
            placeholder="Ex: 2, 4, 6..."
            value={quantidadePessoas}
            onChange={(e) => handleNumPessoasChangeInternal(e.target.value)}
            className="text-center text-xl h-12"
          />
          <p className="text-xs text-muted-foreground text-center">
            Informe quantas pessoas estão na mesa (deixe vazio se não quiser informar)
          </p>
        </div>
      </div>
    </div>
  );
}

