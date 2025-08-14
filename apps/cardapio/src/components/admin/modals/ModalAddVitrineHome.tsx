// components/admin/modals/ModalVitrineMarkHome.tsx
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
import Image from "next/image";

import { useCategoriasSearch } from "@cardapio/services/useQueryCategoria";
import { useVitrinesSearch, useMutateVitrine, VitrineSearchItem } from "@cardapio/services/useQueryVitrine";

type Categoria = {
  id: number;
  descricao: string;
  imagem?: string | null;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codCategoria?: number | null; // opcional: pode vir pré-selecionada
}

export function ModalVitrineMarkHome({ open, onOpenChange, codCategoria }: Props) {
  // Seleção de categoria (para filtrar vitrines)
  const [buscaCat, setBuscaCat] = React.useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = React.useState<number | null>(codCategoria ?? null);
  const { data: categorias = [], isLoading: loadingCats } = useCategoriasSearch(buscaCat, 30);

  // Seleção de vitrine
  const [buscaVitrine, setBuscaVitrine] = React.useState("");
  const vitrinesEnabled = typeof selectedCategoriaId === "number";
  const { data: vitrines = [], isLoading: loadingVitrines } = useVitrinesSearch(buscaVitrine, {
    codCategoria: selectedCategoriaId ?? null,
    debounceMs: 350,
    enabled: vitrinesEnabled,
  });
  const [selectedVitrineId, setSelectedVitrineId] = React.useState<number | null>(null);

  const { markHome } = useMutateVitrine();

  function handleContinue() {
    if (typeof selectedVitrineId !== "number") return;
    markHome.mutate(
      { id: selectedVitrineId, is_home: true },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      }
    );
  }

  function reset() {
    setBuscaCat("");
    setBuscaVitrine("");
    setSelectedVitrineId(null);
    setSelectedCategoriaId(codCategoria ?? null);
  }

  React.useEffect(() => {
    if (!open) reset();
  }, [open]); // eslint-disable-line

  React.useEffect(() => {
    setBuscaVitrine("");
    setSelectedVitrineId(null);
  }, [selectedCategoriaId]);

  const canContinue = typeof selectedVitrineId === "number";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Selecionar categoria e vitrine para destacar na Home</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna esquerda — Categoria */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label>Categoria</Label>
              <Input
                placeholder="Pesquisar categoria..."
                value={buscaCat}
                onChange={(e) => setBuscaCat(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-auto pr-1">
              {loadingCats && (
                <div className="col-span-full text-sm text-muted-foreground">
                  Carregando categorias...
                </div>
              )}

              {!loadingCats && categorias.map((cat: Categoria) => {
                const isSelected = selectedCategoriaId === cat.id;
                return (
                  <div
                    key={cat.id}
                    className={`border rounded-xl p-2 flex flex-col gap-2 hover:shadow-sm transition ${isSelected ? "border-primary" : "border-muted"}`}
                  >
                    <div className="relative w-full h-20 bg-muted rounded-lg overflow-hidden">
                      {cat.imagem ? (
                        <Image src={cat.imagem} alt={cat.descricao} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium line-clamp-2">{cat.descricao}</div>
                    <Button
                      variant={isSelected ? "default" : "secondary"}
                      onClick={() => setSelectedCategoriaId(cat.id)}
                    >
                      {isSelected ? "Selecionada" : "Selecionionar"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna direita — Vitrines filtradas pela categoria */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label>Vitrines da categoria</Label>
              <Input
                placeholder="Filtrar vitrines por título/slug..."
                value={buscaVitrine}
                onChange={(e) => setBuscaVitrine(e.target.value)}
                disabled={!vitrinesEnabled}
              />
            </div>

            <div className="flex flex-col gap-2 max-h-64 overflow-auto pr-1">
              {!vitrinesEnabled && (
                <div className="text-sm text-muted-foreground">
                  Selecione uma categoria para carregar as vitrines.
                </div>
              )}

              {vitrinesEnabled && loadingVitrines && (
                <div className="text-sm text-muted-foreground">Carregando vitrines...</div>
              )}

              {vitrinesEnabled && !loadingVitrines && vitrines.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Nenhuma vitrine encontrada para esta categoria.
                </div>
              )}

              {vitrinesEnabled && !loadingVitrines && vitrines.map((v: VitrineSearchItem) => {
                const selected = selectedVitrineId === v.id;
                return (
                  <button
                    key={v.id}
                    className={`text-left border rounded-lg p-2 hover:shadow-sm transition ${selected ? "border-primary" : "border-muted"}`}
                    onClick={() => setSelectedVitrineId(v.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{v.titulo}</span>
                        <span className="text-xs text-muted-foreground">
                          slug: {v.slug} • ordem: {v.ordem} • {v.is_home ? "Já é Home" : "Normal"}
                        </span>
                      </div>
                      <span className="text-xs">{selected ? "Selecionada" : "Selecionar"}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3">
          <Button onClick={handleContinue} disabled={!canContinue} className="w-full">
            Continuar (marcar como Home)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
