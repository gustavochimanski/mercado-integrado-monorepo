"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Checkbox } from "@supervisor/components/ui/checkbox";
import { useMutateCupom } from "@supervisor/services/useQueryCupons";
import { useParceiros, Parceiro } from "@supervisor/services/useQueryParceiros";
import { Card } from "@supervisor/components/ui/card";

export default function AdicionarCupomModal({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
}) {
  const { create } = useMutateCupom();
  const { data: parceiros = [], isLoading: parceirosLoading } = useParceiros();

  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [descontoValor, setDescontoValor] = useState<number | undefined>();
  const [descontoPercentual, setDescontoPercentual] = useState<number | undefined>();
  const [ativo, setAtivo] = useState(true);
  const [monetizado, setMonetizado] = useState(false);
  const [valorPorLead, setValorPorLead] = useState<number | undefined>();
  const [parceirosIds, setParceirosIds] = useState<number[]>([]);

  const handleSave = async () => {
    try {
      await create.mutateAsync({
        codigo,
        descricao,
        desconto_valor: descontoValor,
        desconto_percentual: descontoPercentual,
        ativo,
        monetizado,
        valor_por_lead: valorPorLead,
        parceiros_ids: parceirosIds,
      });

      if (onSaved) onSaved();
      onOpenChange(false);

      // reset campos
      setCodigo("");
      setDescricao("");
      setDescontoValor(undefined);
      setDescontoPercentual(undefined);
      setAtivo(true);
      setMonetizado(false);
      setValorPorLead(undefined);
      setParceirosIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleParceiro = (id: number) => {
    setParceirosIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Adicionar Cupom</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <Input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <Input
            type="number"
            placeholder="Desconto Valor"
            value={descontoValor ?? ""}
            onChange={(e) => setDescontoValor(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Desconto Percentual"
            value={descontoPercentual ?? ""}
            onChange={(e) => setDescontoPercentual(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Valor por lead"
            value={valorPorLead ?? ""}
            onChange={(e) => setValorPorLead(Number(e.target.value))}
          />

          <div className="flex items-center gap-2">
            <Checkbox checked={ativo} onCheckedChange={(checked) => setAtivo(!!checked)} />
            <label className="text-sm">Ativo</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={monetizado} onCheckedChange={(checked) => setMonetizado(!!checked)} />
            <label className="text-sm">Monetizado</label>
          </div>

          {/* 🟢 Grid de parceiros */}
          {monetizado && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium">Selecione os parceiros:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto">
                {parceirosLoading ? (
                  <p className="col-span-full text-sm text-muted-foreground">Carregando parceiros...</p>
                ) : (
                  parceiros.map((p) => {
                    const isSelected = parceirosIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200
                          ${isSelected ? "bg-blue-50 border-blue-500 shadow-sm" : "bg-white border-gray-200 hover:shadow-sm"}`}
                        onClick={() => toggleParceiro(p.id)}
                      >
                        <span className="text-sm font-medium">{p.nome}</span>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleParceiro(p.id)}
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
