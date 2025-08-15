// components/admin/modals/ModalVitrineMarkHome.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@cardapio/components/Shared/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@cardapio/components/Shared/ui/card";
import Tabs from "@cardapio/components/Shared/ui/tabs";

import { useCategoriasSearch } from "@cardapio/services/useQueryCategoria";
import { useVitrinesSearch, useMutateVitrine, VitrineSearchItem } from "@cardapio/services/useQueryVitrine";

type Categoria = { id: number; descricao: string; imagem?: string | null };

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codCategoria?: number | null; // opcional: pode vir pré-selecionada
}

export function ModalVitrineMarkHome({ open, onOpenChange, codCategoria }: Props) {
  // Abas controladas
  const [tab, setTab] = React.useState<"categoria" | "vitrine">("categoria");

  // Estado categoria
  const [buscaCat, setBuscaCat] = React.useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = React.useState<number | null>(codCategoria ?? null);
  const { data: categorias = [], isLoading: loadingCats } = useCategoriasSearch(buscaCat, {
    enabled: open,
    minLength: 0,
    debounceMs: 300,
    limit: 30,
    allowEmpty: false,
  });

  // Estado vitrine
  const [buscaVitrine, setBuscaVitrine] = React.useState("");
  const vitrinesEnabled = typeof selectedCategoriaId === "number";
  const { data: vitrines = [], isLoading: loadingVitrines } = useVitrinesSearch(buscaVitrine, {
    codCategoria: selectedCategoriaId ?? null,
    debounceMs: 350,
    enabled: vitrinesEnabled && open, // extra safety
  });
  const [selectedVitrineId, setSelectedVitrineId] = React.useState<number | null>(null);

  // toast: controla clique em categoria e só dispara quando o fetch terminar
  const [pendingToastCat, setPendingToastCat] = React.useState<number | null>(null);

  // Mutations
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
    setTab("categoria");
    setBuscaCat("");
    setBuscaVitrine("");
    setSelectedVitrineId(null);
    setSelectedCategoriaId(codCategoria ?? null);
    setPendingToastCat(null);
  }

  React.useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

// 1) Limpa vitrine SOMENTE quando a categoria realmente muda
const prevCatRef = React.useRef<number | null>(selectedCategoriaId);
React.useEffect(() => {
  if (prevCatRef.current !== selectedCategoriaId) {
    setBuscaVitrine("");
    setSelectedVitrineId(null);
    prevCatRef.current = selectedCategoriaId;
  }
}, [selectedCategoriaId]);

// 2) Se estiver na aba "vitrine" e a NOVA categoria não tiver vitrines (sem filtro),
// volta para "categoria". Não interfere quando o usuário está filtrando.
React.useEffect(() => {
  if (
    tab === "vitrine" &&
    vitrinesEnabled &&
    !loadingVitrines &&
    buscaVitrine.trim() === "" &&   // <- garante que não é efeito do filtro digitado
    vitrines.length === 0
  ) {
    setTab("categoria");
    toast("Esta categoria não possui vitrines.", {
      description: "Selecione outra ou crie uma vitrine para ela.",
    });
  }
}, [tab, vitrinesEnabled, loadingVitrines, vitrines.length, buscaVitrine]);


  // Dispara toast quando o fetch concluir e não houver vitrines
  React.useEffect(() => {
    if (
      pendingToastCat !== null &&
      selectedCategoriaId === pendingToastCat &&
      vitrinesEnabled &&
      !loadingVitrines
    ) {
      if (vitrines.length === 0) {
        toast("Esta categoria não possui vitrines.", {
          description: "Selecione outra para avançar ou crie uma vitrine para esta categoria.",
        });
      }
      setPendingToastCat(null); // evita repetir
    }
  }, [pendingToastCat, selectedCategoriaId, vitrinesEnabled, loadingVitrines, vitrines.length]);

  // Regras de habilitação
  const canGoVitrine = vitrinesEnabled && !loadingVitrines && vitrines.length > 0;
  const canAdd = typeof selectedVitrineId === "number";

  // Handlers
  function handleSelectCategoria(id: number) {
    setSelectedCategoriaId(id);
    setPendingToastCat(id);
  }

  function handleTabChange(next: string) {
    if (next === "vitrine" && !canGoVitrine) return; // trava avanço manual
    setTab(next as typeof tab);
  }

  // Bloqueia Enter dentro da aba de vitrines (defensivo contra <form> ancestral)
  const handleKeyDownBlockEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") e.preventDefault();
  };

  // Itens das abas
  const items = [
    {
      value: "categoria",
      label: "1. Categoria",
      Component: () => (
        <div className="grid grid-cols-1 gap-4 p-0">
          <Card className="flex flex-col gap-3">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>Categoria</CardTitle>
              <Input
                placeholder="Pesquisar categoria..."
                value={buscaCat}
                onChange={(e) => setBuscaCat(e.target.value)}
                type="text"
                autoComplete="off"
              />
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-3 max-h-64 overflow-auto p-0">
              {loadingCats && (
                <div className="col-span-full text-sm text-muted-foreground">Carregando categorias...</div>
              )}

              {!loadingCats &&
                categorias.map((cat: Categoria) => {
                  const isSelected = selectedCategoriaId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`border rounded-xl p-2 flex flex-col gap-2 hover:shadow-sm transition ${
                        isSelected ? "border-primary" : "border-muted"
                      }`}
                    >
                      <div className="relative w-full h-20 bg-muted rounded-full overflow-hidden">
                        {cat.imagem ? (
                          <Image src={cat.imagem} alt={cat.descricao} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center text-xs text-muted-foreground">
                            Sem imagem
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-center font-medium line-clamp-2">{cat.descricao}</div>
                      <Button
                        type="button" // <<< FIX: não submete formulário
                        variant={isSelected ? "default" : "secondary"}
                        onClick={() => handleSelectCategoria(cat.id)}
                        className="text-xs"
                      >
                        {isSelected ? "Selecionada" : "Selecionar"}
                      </Button>
                    </div>
                  );
                })}
            </CardContent>

          </Card>
        </div>
      ),
    },
    {
      value: "vitrine",
      label: "2. Vitrine",
      disabled: !canGoVitrine, // desabilita trigger quando não pode
      Component: () => (
        <div className="grid grid-cols-1 gap-4 p-0" onKeyDown={handleKeyDownBlockEnter}>
          <Card className="flex flex-col gap-3">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>Vitrines da categoria</CardTitle>
              <Input
                placeholder="Filtrar vitrines por título/slug..."
                value={buscaVitrine}
                onChange={(e) => setBuscaVitrine(e.target.value)}
                disabled={!vitrinesEnabled}
                type="text"              // <<< FIX
                autoComplete="off"       // <<< FIX
                onKeyDown={(e) => {      // <<< FIX: bloqueia Enter
                  if (e.key === "Enter") e.preventDefault();
                }}
              />
            </CardHeader>

            <CardContent className="flex flex-col gap-2 overflow-auto p-2 max-h-72">
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

              {vitrinesEnabled &&
                !loadingVitrines &&
                vitrines.map((v: VitrineSearchItem) => {
                  const selected = selectedVitrineId === v.id;
                  return (
                    <button
                      type="button" // <<< FIX: não submete formulário
                      key={v.id}
                      className={`text-left border rounded-lg p-2 hover:shadow-sm transition ${
                        selected ? "border-primary" : "border-muted"
                      }`}
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
            </CardContent>
          </Card>
        </div>
      ),
    },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-[90%] overflow-auto p-0">
        <Card>
          <CardHeader>
            <DialogTitle>Selecionar categoria e vitrine para destacar na Home</DialogTitle>
          </CardHeader>

          {/* Abas controladas */}
          <div className="px-3">
            <Tabs
              items={items as any}
              value={tab}
              onValueChange={handleTabChange}
              triggerClassName="rounded-xl"
              contentClassName="p-3"
            />
          </div>

          {/* Rodapé fixo */}
          <CardFooter className="sticky bottom-0 left-0 w-full bg-background border-t  p-0 flex gap-2">
            {tab === "categoria" ? (
              <>
                <Button type="button" variant="destructive" onClick={() => onOpenChange(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="button" onClick={() => setTab("vitrine")} disabled={!canGoVitrine} className="flex-1">
                  Próximo
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setTab("categoria")} className="flex-1">
                  Voltar
                </Button>
                <Button type="button" onClick={handleContinue} disabled={!canAdd} className="flex-1">
                  Adicionar
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
