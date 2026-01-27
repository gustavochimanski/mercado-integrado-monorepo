"use client";

import * as React from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { useVitrinesSearch, useMutateVitrine } from "@cardapio/services/vitrine";

type Item = { id: number; titulo: string; ordem: number };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codCategoria: number | null;
}

function moveItem<T>(arr: T[], from: number, to: number) {
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}

export function ModalReordenarVitrines({ open, onOpenChange, codCategoria }: Props) {
  const { data: vitrines, isLoading } = useVitrinesSearch("", {
    codCategoria,
    enabled: open, // permite carregar mesmo quando codCategoria é null (landing)
    limit: 200,
    debounceMs: 0,
  });

  const { reorder } = useMutateVitrine();

  const [items, setItems] = React.useState<Item[]>([]);
  const draggingIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!open) return;
    if (!vitrines) return;
    const normalized = vitrines
      .map((v) => ({ id: v.id, titulo: v.titulo, ordem: v.ordem }))
      .sort((a, b) => a.ordem - b.ordem);
    setItems(normalized);
  }, [open, vitrines]);

  const canSave = items.length > 0 && !reorder.isPending;

  function handleSave() {
    // ordem 1..N na ordem atual da lista
    const payload = items.map((it, idx) => ({ id: it.id, ordem: idx + 1 }));
    reorder.mutate(payload);
  }

  function onDragStart(id: number) {
    draggingIdRef.current = id;
  }

  function onDrop(targetId: number) {
    const sourceId = draggingIdRef.current;
    draggingIdRef.current = null;
    if (!sourceId) return;
    if (sourceId === targetId) return;

    const from = items.findIndex((i) => i.id === sourceId);
    const to = items.findIndex((i) => i.id === targetId);
    if (from < 0 || to < 0) return;
    setItems((prev) => moveItem(prev, from, to));
  }

  function moveUp(idx: number) {
    if (idx <= 0) return;
    setItems((prev) => moveItem(prev, idx, idx - 1));
  }

  function moveDown(idx: number) {
    if (idx >= items.length - 1) return;
    setItems((prev) => moveItem(prev, idx, idx + 1));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reordenar vitrines</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted-foreground">
            Arraste uma vitrine para mudar a posição (ou use as setas). Depois clique em “Salvar ordem”.
          </p>

          {isLoading && (
            <div className="text-sm text-muted-foreground">Carregando vitrines...</div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="text-sm text-muted-foreground">Nenhuma vitrine para reordenar.</div>
          )}

          <div className="max-h-[50vh] overflow-auto rounded-md border">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="flex items-center gap-2 px-3 py-2 border-b last:border-b-0 bg-background"
                draggable
                onDragStart={() => onDragStart(it.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(it.id)}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{it.titulo}</div>
                  <div className="text-xs text-muted-foreground">Posição: {idx + 1}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0 || reorder.isPending}
                    aria-label="Mover para cima"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => moveDown(idx)}
                    disabled={idx === items.length - 1 || reorder.isPending}
                    aria-label="Mover para baixo"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleSave} disabled={!canSave} className="w-full">
            {reorder.isPending ? "Salvando..." : "Salvar ordem"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

