"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@supervisor/components/ui/dialog";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { Handshake } from "lucide-react";
import { useMutateParceiro, ParceiroCompletoOut } from "@supervisor/services/useQueryParceiros";

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
  const [loading, setLoading] = useState(false);
  const { create, update } = useMutateParceiro();

  useEffect(() => {
    if (parceiro) {
      setNome(parceiro.nome);
      setAtivo(parceiro.ativo);
    } else {
      setNome("");
      setAtivo(true);
    }
  }, [parceiro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) return;

    setLoading(true);
    try {
      if (parceiro) {
        await update.mutateAsync({
          id: parceiro.id,
          nome: nome.trim(),
          ativo,
        });
      } else {
        await create.mutateAsync({
          nome: nome.trim(),
          ativo,
        });
      }

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar parceiro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {parceiro ? "Editar Parceiro" : "Cadastrar Parceiro"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="flex items-center gap-2">              
              Nome do Parceiro *
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do parceiro"
              required
            />
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="ativo">Parceiro Ativo</Label>
            <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!nome.trim() || loading} className="flex-1">
              {loading ? "Salvando..." : parceiro ? "Salvar Alterações" : "Cadastrar Parceiro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
