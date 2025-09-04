"use client";

import { useEffect, useState } from "react";
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
import { useMutateCupom, Cupom } from "@supervisor/services/useQueryCupons";

interface EditarCupomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cupom: Cupom;
  onSaved?: () => void;
}

export default function EditarCupomModal({
  open,
  onOpenChange,
  cupom,
  onSaved,
}: EditarCupomModalProps) {
  const { update } = useMutateCupom();

  const [codigo, setCodigo] = useState(cupom.codigo);
  const [descricao, setDescricao] = useState(cupom.descricao || "");
  const [descontoValor, setDescontoValor] = useState<number | undefined>(cupom.desconto_valor);
  const [descontoPercentual, setDescontoPercentual] = useState<number | undefined>(cupom.desconto_percentual);
  const [ativo, setAtivo] = useState(cupom.ativo);
  const [monetizado, setMonetizado] = useState(cupom.monetizado);
  const [valorPorLead, setValorPorLead] = useState<number | undefined>(cupom.valor_por_lead);

  useEffect(() => {
    if (cupom) {
      setCodigo(cupom.codigo);
      setDescricao(cupom.descricao || "");
      setDescontoValor(cupom.desconto_valor);
      setDescontoPercentual(cupom.desconto_percentual);
      setAtivo(cupom.ativo);
      setMonetizado(cupom.monetizado);
      setValorPorLead(cupom.valor_por_lead);
    }
  }, [cupom]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        id: cupom.id,
        codigo,
        descricao,
        desconto_valor: descontoValor,
        desconto_percentual: descontoPercentual,
        ativo,
        monetizado,
        valor_por_lead: valorPorLead,
      });

      if (onSaved) onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Cupom</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          <Input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <Input type="number" placeholder="Desconto Valor" value={descontoValor ?? ""} onChange={(e) => setDescontoValor(Number(e.target.value))} />
          <Input type="number" placeholder="Desconto Percentual" value={descontoPercentual ?? ""} onChange={(e) => setDescontoPercentual(Number(e.target.value))} />
          <Input type="number" placeholder="Valor por lead" value={valorPorLead ?? ""} onChange={(e) => setValorPorLead(Number(e.target.value))} />

          <div className="flex items-center gap-2">
            <Checkbox checked={ativo} onCheckedChange={(checked) => setAtivo(!!checked)} />
            <label className="text-sm">Ativo</label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox checked={monetizado} onCheckedChange={(checked) => setMonetizado(!!checked)} />
            <label className="text-sm">Monetizado</label>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
