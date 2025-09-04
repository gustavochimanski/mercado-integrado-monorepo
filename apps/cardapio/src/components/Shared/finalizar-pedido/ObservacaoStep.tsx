"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@cardapio/components/Shared/ui/textarea";
import { Label } from "@cardapio/components/Shared/ui/label";

interface Props {
  observacao?: string;
  onChange: (texto: string) => void;
}

export default function ObservacaoStep({ observacao, onChange }: Props) {
  const [texto, setTexto] = useState(observacao ?? "");

  // sempre sincroniza com o pai (ex: carrinho)
  useEffect(() => {
    setTexto(observacao ?? "");
  }, [observacao]);

  return (
    <div className="space-y-3 p-2">
      <Label htmlFor="observacao" className="text-base font-semibold">
        Alguma observação?
      </Label>
      <Textarea
        id="observacao"
        value={texto}
        onChange={(e) => {
          setTexto(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Ex: Tirar cebola, entregar na portaria, etc."
        className="min-h-[120px] resize-none"
      />
      <p className="text-xs text-muted-foreground">
        Essa observação será enviada junto com seu pedido.
      </p>
    </div>
  );
}
