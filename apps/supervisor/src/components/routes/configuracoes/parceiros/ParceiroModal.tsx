"use client";

import React, { useState, useEffect } from "react";
import { useMutateParceiro } from "@supervisor/services/useQueryParceiros";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Checkbox } from "@supervisor/components/ui/checkbox";
import { toast } from "sonner";

interface ParceiroModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parceiro?: { id: number; nome: string; ativo: boolean } | null;
  onSaved?: () => Promise<any>;
}

export default function ParceiroModal({ open, onOpenChange, parceiro, onSaved }: ParceiroModalProps) {
  const [nome, setNome] = useState("");
  const [ativo, setAtivo] = useState(true);
  const { create, update } = useMutateParceiro();

  // Preenche formulário ao abrir edição
  useEffect(() => {
    if (parceiro) {
      setNome(parceiro.nome);
      setAtivo(Boolean(parceiro.ativo)); 
    } else {
      setNome("");
      setAtivo(true);
    }
  }, [parceiro, open]); // adicionando `open` garante reset ao abrir modal

  const handleSave = async () => {
    if (!nome.trim()) {
      toast.error("O nome do parceiro é obrigatório.");
      return;
    }

    try {
      // Força booleano para garantir valor correto
      const ativoValue = Boolean(ativo);
      console.log("Enviando para backend:", { nome, ativo: ativoValue });

      if (parceiro) {
        await update.mutateAsync({ id: parceiro.id, nome, ativo: ativoValue });
        toast.success("Parceiro atualizado!");
      } else {
        await create.mutateAsync({ nome, ativo: ativoValue });
        toast.success("Parceiro criado!");
      }

      if (onSaved) await onSaved();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar parceiro.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{parceiro ? "Editar Parceiro" : "Novo Parceiro"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <label className="font-medium">Nome</label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do parceiro"
          />

          <div className="flex items-center gap-2">
          <Checkbox
            checked={ativo}
            onCheckedChange={(checked) => {
              console.log("checked mudou para:", checked);
              setAtivo(checked === true);
            }}
          />


            <span>Ativo</span>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>{parceiro ? "Atualizar" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
