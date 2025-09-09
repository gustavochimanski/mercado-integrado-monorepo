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
import { Label } from "@supervisor/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@supervisor/components/ui/select";

import { useMutateCupom, Cupom } from "@supervisor/services/useQueryCupons";
import { useParceiros } from "@supervisor/services/useQueryParceiros";
import GerenciarLinksModal from "./GerenciarLinksModal"; // <-- import do modal separado

interface EditarCupomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cupom: Cupom;
  onSaved?: () => void;
}

export default function EditarCupomModal({ open, onOpenChange, cupom, onSaved }: EditarCupomModalProps) {
  const { update } = useMutateCupom();
  const { data: parceiros = [], isLoading: parceirosLoading } = useParceiros();

  // --- estado do cupom ---
  const [codigo, setCodigo] = useState(cupom.codigo);
  const [descricao, setDescricao] = useState(cupom.descricao || "");
  const [descontoValor, setDescontoValor] = useState<number | undefined>(cupom.desconto_valor);
  const [descontoPercentual, setDescontoPercentual] = useState<number | undefined>(cupom.desconto_percentual);
  const [ativo, setAtivo] = useState(cupom.ativo);
  const [monetizado, setMonetizado] = useState(cupom.monetizado);
  const [valorPorLead, setValorPorLead] = useState<number | undefined>(cupom.valor_por_lead);
  const [parceiroId, setParceiroId] = useState<number | undefined>(cupom.parceiro_id);

  useEffect(() => {
    if (cupom) {
      setCodigo(cupom.codigo);
      setDescricao(cupom.descricao || "");
      setDescontoValor(cupom.desconto_valor);
      setDescontoPercentual(cupom.desconto_percentual);
      setAtivo(cupom.ativo);
      setMonetizado(cupom.monetizado);
      setValorPorLead(cupom.valor_por_lead);
      setParceiroId(cupom.parceiro_id);
    }
  }, [cupom]);

  // --- salvar cupom ---
  const handleSaveCupom = async () => {
    if (monetizado && !parceiroId) {
      alert("Selecione um parceiro para cupom monetizado.");
      return;
    }

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
        parceiro_id: parceiroId,
      });

      if (onSaved) onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            {/* Campos do cupom */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Código</Label>
                <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              </div>
              <div>
                <Label>Descrição</Label>
                <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div>
                <Label>Desconto Valor</Label>
                <Input type="number" value={descontoValor ?? ""} onChange={(e) => setDescontoValor(Number(e.target.value))} />
              </div>
              <div>
                <Label>Desconto Percentual</Label>
                <Input type="number" value={descontoPercentual ?? ""} onChange={(e) => setDescontoPercentual(Number(e.target.value))} />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <Checkbox checked={ativo} onCheckedChange={(checked) => setAtivo(!!checked)} />
              <label>Ativo</label>

              <Checkbox checked={monetizado} onCheckedChange={(checked) => setMonetizado(!!checked)} />
              <label>Monetizado</label>
            </div>

            {/* Modal de links */}
            <GerenciarLinksModal
              cupomId={cupom.id}
              initialLinks={cupom.links || []}
            />

            {monetizado && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label>Parceiro</Label>
                  {parceirosLoading ? (
                    <p>Carregando parceiros...</p>
                  ) : (
                    <Select value={parceiroId?.toString() ?? ""} onValueChange={(val) => setParceiroId(Number(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um parceiro" />
                      </SelectTrigger>
                      <SelectContent>
                        {parceiros.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div>
                  <Label>Valor por Lead</Label>
                  <Input type="number" value={valorPorLead ?? ""} onChange={(e) => setValorPorLead(Number(e.target.value))} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleSaveCupom}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </>
  );
}
