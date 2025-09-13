"use client";

import { useState, useEffect } from "react";

export default function PagamentoStep({ meios, selecionado, onSelect }: any) {
  const [selected, setSelected] = useState<number | null>(selecionado ?? null);

  useEffect(() => setSelected(selecionado ?? null), [selecionado]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Forma de Pagamento</h2>
      
      {meios.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum meio de pagamento disponível</p>
        </div>
      )}

      <div className="grid gap-3">
        {meios.map((m: any) => {
          const isSelected = selected === m.id;
          return (
            <div
              key={m.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelected(m.id);
                onSelect(m.id);
              }}
              className={`relative rounded-xl border p-3 sm:p-4 cursor-pointer 
                ${isSelected ? "border-primary ring-2 ring-primary/30 bg-primary/5" : "border-muted-foreground/20 "}
              `}
            >
              <span className="font-medium">{m.nome}</span>
              {isSelected && (
                <span className="absolute top-3 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
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
