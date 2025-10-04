"use client";

import { useState } from "react";
import { Button } from "@supervisor/components/ui/button";
import { Input } from "@supervisor/components/ui/input";
import { Label } from "@supervisor/components/ui/label";
import { Switch } from "@supervisor/components/ui/switch";
import { Handshake } from "lucide-react";
import { useMutateParceiro, ParceiroCompletoOut } from "@supervisor/services/useQueryParceiros";
import { useToast } from "@supervisor/hooks/use-toast";

interface TabDadosParceiroProps {
  parceiro: ParceiroCompletoOut;
  onSaved: () => void;
}

export default function TabDadosParceiro({ parceiro, onSaved }: TabDadosParceiroProps) {
  const [nome, setNome] = useState(parceiro.nome);
  const [ativo, setAtivo] = useState(parceiro.ativo);
  const [loading, setLoading] = useState(false);

  const { update } = useMutateParceiro();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) return;

    setLoading(true);
    try {
      await update.mutateAsync({
        id: parceiro.id,
        nome: nome.trim(),
        ativo,
      });

      toast({
        title: "Parceiro atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });

      onSaved();
    } catch (error) {
      console.error("Erro ao atualizar parceiro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        {/* Nome */}
        <div className="space-y-2">
          <Label htmlFor="nome" className="flex items-center gap-2">
            <Handshake size={16} />
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
      </div>

      {/* Botão fixo no final */}
      <div className="sticky bottom-0 bg-background pt-4 border-t mt-auto">
        <Button type="submit" disabled={!nome.trim() || loading} className="w-full">
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
}
