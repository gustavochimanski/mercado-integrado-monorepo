"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import { Label } from "@cardapio/components/Shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import {
  useCategoriaById,
  useCategoriasSearch,
  useMutateCategoria,
  CategoriaSearchItem,
} from "@cardapio/services/categoria";

interface ModalEditCategoriaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  categoriaId: number;
}

type CategoriaTreeNode = CategoriaSearchItem & { children: CategoriaTreeNode[] };

function buildCategoryTree(categorias: CategoriaSearchItem[]) {
  const map = new Map<number, CategoriaTreeNode>();
  const roots: CategoriaTreeNode[] = [];

  categorias.forEach((categoria) => {
    map.set(categoria.id, { ...categoria, children: [] });
  });

  map.forEach((node) => {
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortTree = (nodes: CategoriaTreeNode[]) => {
    nodes.sort((a, b) => a.descricao.localeCompare(b.descricao, "pt-BR"));
    nodes.forEach((child) => sortTree(child.children));
  };

  sortTree(roots);

  return { roots, map };
}

function collectDescendants(node: CategoriaTreeNode | undefined, accumulator: Set<number>) {
  if (!node) return;
  node.children.forEach((child) => {
    accumulator.add(child.id);
    collectDescendants(child, accumulator);
  });
}

export const ModalEditCategoria = ({
  open,
  onOpenChange,
  empresaId,
  categoriaId,
}: ModalEditCategoriaProps) => {
  const {
    data: categoria,
    isLoading,
    isError,
  } = useCategoriaById(open ? categoriaId : null, { enabled: open });

  const [descricao, setDescricao] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  const { data: categorias = [], isLoading: isLoadingCategorias } = useCategoriasSearch("", {
    enabled: open,
    minLength: 0,
    debounceMs: 200,
    allowEmpty: true,
    limit: 500,
  });

  const { update } = useMutateCategoria();
  const isUpdating = update.isPending;

  useEffect(() => {
    if (!categoria) return;
    setDescricao(categoria.label);
    setSelectedParentId(categoria.parent_id ?? null);
  }, [categoria]);

  const treeData = useMemo(() => buildCategoryTree(categorias), [categorias]);

  const excludedIds = useMemo(() => {
    if (!categoria) return new Set<number>();
    const excluded = new Set<number>([categoria.id]);
    const currentNode = treeData.map.get(categoria.id);
    collectDescendants(currentNode, excluded);
    return excluded;
  }, [categoria, treeData]);

  const renderTree = (nodes: CategoriaTreeNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      if (excludedIds.has(node.id)) return null;
      const isSelected = selectedParentId === node.id;
      return (
        <React.Fragment key={node.id}>
          <button
            type="button"
            onClick={() => setSelectedParentId(node.id)}
            className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${
              isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
            }`}
            style={{ paddingLeft: 16 + depth * 16 }}
          >
            {node.descricao}
          </button>
          {node.children.length > 0 && renderTree(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  const handleSubmit = () => {
    if (!categoria || !descricao.trim()) return;
    if (selectedParentId === categoria.id) return;

    update.mutate({
      cod_empresa: empresaId,
      id: categoria.id,
      descricao: descricao.trim(),
      parent_id: selectedParentId ?? null,
      posicao: categoria.posicao,
    });

    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carregando categoria...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError || !categoria) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar detalhes da categoria</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="descricao-categoria">Descrição da categoria</Label>
            <Input
              id="descricao-categoria"
              placeholder="Digite a descrição da categoria"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Posicionamento na árvore</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedParentId(null)}
                className="h-8 px-2"
              >
                Definir como raiz
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Escolha a categoria pai para reorganizar a hierarquia. Categorias filhas e a própria categoria atual não podem ser selecionadas.
            </p>

            <div className="max-h-72 overflow-y-auto rounded-md border">
              {isLoadingCategorias ? (
                <div className="px-3 py-4 text-sm text-muted-foreground">Carregando categorias...</div>
              ) : treeData.roots.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground">Nenhuma outra categoria encontrada.</div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedParentId(null)}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm transition ${
                      selectedParentId === null ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    (sem categoria pai)
                  </button>
                  {renderTree(treeData.roots)}
                </>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating || !descricao.trim()}
          >
            {isUpdating ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
