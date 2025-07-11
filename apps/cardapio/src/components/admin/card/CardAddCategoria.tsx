// CardAddCategoria.tsx
"use client";

import { CirclePlus } from "lucide-react";
import { Card } from "../../ui/card";
import { useUserContext } from "@packs/auth";
import { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useMutateCategoria } from "@cardapio/hooks/useMutateCategoria";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@packs/ui/src/dialog";

const CardAddCategoria = ({ parentSlug = null }: { parentSlug?: string | null }) => {
  const { isAdmin } = useUserContext();
  const { createSub } = useMutateCategoria(parentSlug ?? null);

  const [open, setOpen] = useState(false);
  const [descricao, setDescricao] = useState("");

  if (!isAdmin) return null;

  function handleSubmit() {
    if (!descricao.trim()) return;

    createSub.mutate(
      { descricao },
      {
        onSuccess: () => {
          setDescricao("");
          setOpen(false);
        },
      }
    );
  }

  return (
    <>
      <Card
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-muted flex flex-col items-center w-[120px] full gap-1 p-2 border-dashed border-2 border-gray-300"
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-background flex items-center justify-center">
          <CirclePlus className="w-8 h-8 text-muted-foreground" />
        </div>
        <span className="block text-center text-sm font-semibold truncate max-w-full">
          Nova Categoria
        </span>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Descrição da nova categoria"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <Button onClick={handleSubmit} disabled={createSub.isPending}>
            Criar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardAddCategoria;
