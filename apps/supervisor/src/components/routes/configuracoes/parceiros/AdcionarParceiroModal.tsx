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
import { useMutateParceiro, Parceiro } from "@supervisor/services/useQueryParceiros";

interface AdicionarParceiroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro?: Parceiro | null;
  onSaved?: () => void;
}

export default function AdicionarParceiroModal({
  open,
  onOpenChange,
  parceiro,
  onSaved,
}: AdicionarParceiroModalProps) {
  const { create, update } = useMutateParceiro();

  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);

  // 🔄 sempre que mudar parceiro, atualiza os campos
  useEffect(() => {
    if (parceiro) {
      setNome(parceiro.nome);
      setAtivo(parceiro.ativo);
    } else {
      setNome("");
      setAtivo(true);
    }
  }, [parceiro, open]);

  const handleSave = async () => {
    try {
      if (parceiro) {
        // editar
        await update.mutateAsync({ id: parceiro.id, nome, ativo });
      } else {
        // criar
        await create.mutateAsync({ nome, ativo });
      }

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
          <DialogTitle>
            {parceiro ? "Editar parceiro" : "Adicionar parceiro"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Nome do parceiro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Checkbox
              id="ativo"
              checked={ativo}
              onCheckedChange={(checked) => setAtivo(!!checked)}
            />
            <label htmlFor="ativo" className="text-sm">
              Ativo
            </label>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
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
