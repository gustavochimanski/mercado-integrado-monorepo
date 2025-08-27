"use client";

import { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@cardapio/components/Shared/ui/radio-group";
import { Label } from "@cardapio/components/Shared/ui/label";

export default function PagamentoStep({ meios, selecionado, onSelect }: any) {
  const [selected, setSelected] = useState(String(selecionado ?? ""));

  useEffect(() => setSelected(String(selecionado ?? "")), [selecionado]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      <RadioGroup value={selected} onValueChange={(id) => { setSelected(id); onSelect(Number(id)); }}>
        {meios.map((m: any) => (
          <div key={m.id} className="flex items-center gap-2">
            <RadioGroupItem value={String(m.id)} id={`pg-${m.id}`} />
            <Label htmlFor={`pg-${m.id}`}>{m.nome}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
