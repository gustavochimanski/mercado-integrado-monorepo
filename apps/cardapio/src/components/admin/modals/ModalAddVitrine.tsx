// ModalAddVitrine.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@cardapio/components/Shared/ui/button";
import { Input } from "@cardapio/components/Shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Label } from "@cardapio/components/Shared/ui/label";
import { useMutateVitrine } from "@cardapio/services/useQueryVitrine";
import { useHome } from "@cardapio/services/useQueryHome"; // para listar categorias
import Image from "next/image";

interface ModalAddVitrineProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codCategoria?: number | null; // fallback quando NÃO estiver na home
  is_home: boolean;
  empresa_id: number;
}

type Categoria = {
  id: number;
  descricao: string;
  imagem?: string | null;
};

export const ModalAddVitrine = ({
  open,
  onOpenChange,
  codCategoria,
  is_home,
  empresa_id,
}: ModalAddVitrineProps) => {
  const pathname = usePathname();
  const isOnHome = pathname === "/" || pathname === ""; // segurança

  const [titulo, setTitulo] = useState("");
  const [ordem, setOrdem] = useState<number>(1);
  const [busca, setBusca] = useState("");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(codCategoria ?? null);

  // carrega categorias só se estiver na home (onde precisa escolher)
  const { data: homeData } = useHome(isOnHome ? empresa_id : 0, true);
  const categorias: Categoria[] = (homeData?.categorias ?? []) as any;

  const categoriasFiltradas = useMemo(() => {
    if (!Array.isArray(categorias)) return [];
    const q = busca.trim().toLowerCase();
    if (!q) return categorias;
    return categorias.filter((c) =>
      (c.descricao ?? "").toLowerCase().includes(q)
    );
  }, [busca, categorias]);

  const { create } = useMutateVitrine();

  function handleSubmit() {
    // Decide qual cod_categoria usar:
    // - se estiver na home e is_home=true: precisa ter selecionado no grid
    // - caso contrário: usa o codCategoria vindo por props
    const finalCodCategoria =
      isOnHome && is_home ? selectedCategoriaId : codCategoria ?? selectedCategoriaId;

    if (!titulo.trim() || typeof finalCodCategoria !== "number") {
      // validações simples de UX
      return;
    }

    create.mutate(
      {
        cod_categoria: finalCodCategoria,
        titulo,
        ordem,
        is_home,
        empresa_id, // será ignorado pelo hook ao enviar
      },
      {
        onSuccess: () => {
          setTitulo("");
          setOrdem(1);
          setBusca("");
          onOpenChange(false);
        },
        onError: (err) => console.error("Erro ao criar Vitrine:", err),
      }
    );
  }

  useEffect(() => {
    if (!open) {
      setTitulo("");
      setOrdem(1);
      setBusca("");
      setSelectedCategoriaId(codCategoria ?? null);
    }
  }, [open, codCategoria]);

  const canSubmit =
    !!titulo.trim() &&
    (isOnHome && is_home ? typeof selectedCategoriaId === "number" : typeof (codCategoria ?? selectedCategoriaId) === "number");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Vitrine</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {/* Campo título */}
          <div className="flex flex-col gap-2">
            <Label>Título</Label>
            <Input
              placeholder="Título da nova Vitrine"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          {/* Campo ordem */}
          <div className="flex flex-col gap-2">
            <Label>Ordem</Label>
            <Input
              type="number"
              placeholder="Ordem (ex: 1, 2, 3...)"
              value={ordem}
              onChange={(e) => setOrdem(Number(e.target.value))}
            />
          </div>

          {/* Se estiver na home e a vitrine for destaque, permitir escolher a categoria */}
          {isOnHome && is_home && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label>Selecionar categoria para esse destaque</Label>
                <Input
                  placeholder="Pesquisar categoria por nome..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>

              {/* Grade de categorias */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-auto pr-1">
                {categoriasFiltradas.map((cat) => {
                  const isSelected = selectedCategoriaId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`border rounded-xl p-2 flex flex-col gap-2 hover:shadow-sm transition ${
                        isSelected ? "border-primary" : "border-muted"
                      }`}
                    >
                      <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                        {cat.imagem ? (
                          <Image
                            src={cat.imagem}
                            alt={cat.descricao}
                            fill
                            className="object-cover"
                          />
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
                        {isSelected ? "Selecionada" : "Selecionar"}
                      </Button>
                    </div>
                  );
                })}
                {categoriasFiltradas.length === 0 && (
                  <div className="col-span-full text-sm text-muted-foreground">
                    Nenhuma categoria encontrada.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-1">
            <Button onClick={handleSubmit} disabled={create.isPending || !canSubmit} className="w-full">
              {create.isPending ? "Criando..." : "Criar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
