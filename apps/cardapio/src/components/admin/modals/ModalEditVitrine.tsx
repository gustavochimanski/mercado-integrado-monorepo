// components/admin/modals/ModalEditVitrine.tsx
"use client";

import * as React from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Label } from "@cardapio/components/Shared/ui/label";
import { useMutateVitrine, useVitrinesSearch } from "@cardapio/services/vitrine";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vitrineId: number;
  tituloInicial: string;
  codCategoriaInicial: number | null;
  ordemInicial?: number;
  isHomeInicial?: boolean;
}

export function ModalEditVitrine({
  open,
  onOpenChange,
  vitrineId,
  tituloInicial,
  codCategoriaInicial,
  ordemInicial,
  isHomeInicial = false,
}: Props) {
  // Estados dos campos editáveis
  const [titulo, setTitulo] = React.useState(tituloInicial);
  const [ordem, setOrdem] = React.useState<number>(ordemInicial ?? 1);
  const [isHome, setIsHome] = React.useState(isHomeInicial);

  const { update } = useMutateVitrine();

  // Buscar dados da vitrine se ordem não foi fornecida
  const { data: vitrines } = useVitrinesSearch("", {
    codCategoria: codCategoriaInicial ?? null,
    enabled: open && ordemInicial === undefined,
    limit: 100,
  });

  // Encontrar a vitrine atual e obter a ordem
  React.useEffect(() => {
    if (open && ordemInicial === undefined && vitrines) {
      const vitrine = vitrines.find((v) => v.id === vitrineId);
      if (vitrine) {
        setOrdem(vitrine.ordem);
      }
    }
  }, [open, ordemInicial, vitrines, vitrineId]);

  // Atualizar estados quando props mudarem
  React.useEffect(() => {
    if (open) {
      setTitulo(tituloInicial);
      setOrdem(ordemInicial ?? 1);
      setIsHome(isHomeInicial);
    }
  }, [open, tituloInicial, ordemInicial, isHomeInicial]);

  function handleUpdate() {
    if (!titulo.trim()) return;

    const payload: {
      id: number;
      titulo?: string;
      ordem?: number;
      is_home?: boolean;
      cod_categoria?: number;
    } = {
      id: vitrineId,
      titulo: titulo.trim(),
      ordem: ordem,
      is_home: isHome,
    };

    // Incluir cod_categoria apenas se for um número válido
    if (typeof codCategoriaInicial === "number") {
      payload.cod_categoria = codCategoriaInicial;
    }

    update.mutate(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  const canUpdate = !!titulo.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar vitrine</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Campo título */}
          <div className="flex flex-col gap-2">
            <Label>Título</Label>
            <Input
              placeholder="Ex.: Ofertas da Semana"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Campo ordem */}
          <div className="flex flex-col gap-2">
            <Label>Ordem</Label>
            <Input
              type="number"
              min={1}
              value={ordem}
              onChange={(e) => setOrdem(Number(e.target.value || 1))}
            />
            <p className="text-xs text-muted-foreground">
              A ordem determina a sequência de exibição da vitrine
            </p>
          </div>

          {/* Campo is_home */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_home"
              checked={isHome}
              onChange={(e) => setIsHome(e.target.checked)}
              className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
            />
            <Label htmlFor="is_home" className="cursor-pointer">
              Exibir na Home
            </Label>
          </div>

          {/* Botão atualizar */}
          <Button
            onClick={handleUpdate}
            disabled={update.isPending || !canUpdate}
            className="w-full"
          >
            {update.isPending ? "Atualizando..." : "Atualizar vitrine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
