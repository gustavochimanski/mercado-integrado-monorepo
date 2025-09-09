"use client";

import { useState } from "react";
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
import { useParceiros } from "@supervisor/services/useQueryParceiros";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@supervisor/components/ui/select";

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
  const [parceiroId, setParceiroId] = useState<number | undefined>();

  const handleSave = async () => {
    if (monetizado && !parceiroId) {
      alert("Selecione um parceiro para cupom monetizado.");
      return;
    }

    try {
      await create.mutateAsync({
        codigo,
        descricao,
        desconto_valor: descontoValor,
        desconto_percentual: descontoPercentual,
        ativo,
        monetizado,
        valor_por_lead: valorPorLead,
        parceiro_id: parceiroId, // agora é apenas 1
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
      setParceiroId(undefined);
    } catch (err) {
      console.error(err);
    }
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

          {monetizado && (
            <div className="mt-4">
              <label className="block mb-2 text-sm font-medium">Selecione um parceiro:</label>
              {parceirosLoading ? (
                <p className="text-sm text-muted-foreground">Carregando parceiros...</p>
              ) : (
                <Select value={parceiroId?.toString() ?? ""} onValueChange={(val) => setParceiroId(Number(val))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha um parceiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {parceiros.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
