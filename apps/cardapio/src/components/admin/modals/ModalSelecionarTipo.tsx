"use client";

import * as React from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Package, ChefHat } from "lucide-react";
import { ModalNovoProduto } from "./ModalAddProduto";
import { ModalNovoCombo } from "./ModalAddCombo";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  vitrineId: number;
}

type TipoItem = "produto" | "combo" | null;

export const ModalSelecionarTipo = ({
  open,
  onOpenChange,
  empresaId,
  vitrineId,
}: Props) => {
  const [tipoSelecionado, setTipoSelecionado] = React.useState<TipoItem>(null);

  React.useEffect(() => {
    if (!open) {
      setTipoSelecionado(null);
    }
  }, [open]);

  const handleClose = () => {
    setTipoSelecionado(null);
    onOpenChange(false);
  };

  if (tipoSelecionado === "produto") {
    return (
      <ModalNovoProduto
        open={open}
        onOpenChange={handleClose}
        empresaId={empresaId}
        vitrineId={vitrineId}
      />
    );
  }

  if (tipoSelecionado === "combo") {
    return (
      <ModalNovoCombo
        open={open}
        onOpenChange={handleClose}
        empresaId={empresaId}
        vitrineId={vitrineId}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione o tipo de item</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={() => setTipoSelecionado("produto")}
          >
            <Package className="w-12 h-12 text-primary" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold">Produto</span>
              <span className="text-sm text-muted-foreground">
                Adicionar um produto à vitrine
              </span>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-primary/5 hover:border-primary transition-all"
            onClick={() => setTipoSelecionado("combo")}
          >
            <ChefHat className="w-12 h-12 text-primary" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-semibold">Combo</span>
              <span className="text-sm text-muted-foreground">
                Adicionar um combo à vitrine
              </span>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

