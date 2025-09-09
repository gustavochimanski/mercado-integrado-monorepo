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
import { Switch } from "@supervisor/components/ui/switch";
import {
  useMutateParceiro,
  ParceiroCompletoOut,
} from "@supervisor/services/useQueryParceiros";

interface AdicionarParceiroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro?: ParceiroCompletoOut | null;
  onSaved?: () => void;
}

export default function AdicionarParceiroModal({
  open,
  onOpenChange,
  parceiro,
  onSaved,
}: AdicionarParceiroModalProps) {
  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const { create, update } = useMutateParceiro(); // pega as duas mutations

  useEffect(() => {
    if (parceiro) {
      setNome(parceiro.nome);
      setAtivo(parceiro.ativo);
    } else {
      setNome("");
      setAtivo(true);
    }
  }, [parceiro]);

  const handleSave = async () => {
    if (parceiro) {
      // editar
      await update.mutateAsync({
        id: parceiro.id,
        nome,
        ativo,
      });
    } else {
      // criar
      await create.mutateAsync({
        nome,
        ativo,
      });
    }

    onSaved?.();
    onOpenChange(false);
  };

  console.log(parceiro)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {parceiro ? "Editar Parceiro" : "Novo Parceiro"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            placeholder="Nome do parceiro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Switch checked={ativo} onCheckedChange={setAtivo} />
            <span>Ativo</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {parceiro ? "Salvar alterações" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
