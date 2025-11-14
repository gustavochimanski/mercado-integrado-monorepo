"use client";

import * as React from "react";
import { Button } from "@cardapio/components/Shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@cardapio/components/Shared/ui/dialog";
import { Input } from "@cardapio/components/Shared/ui/input";
import { useSearchProdutos } from "@cardapio/services/useQueryProduto";
import { useMutateVitrine } from "@cardapio/services/useQueryVitrine";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  vitrineId: number;
}

export const ModalNovaReceita = ({
  open,
  onOpenChange,
  empresaId,
  vitrineId,
}: Props) => {
  const [busca, setBusca] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching } = useSearchProdutos(empresaId, busca, {
    page,
    limit: 30,
    apenas_disponiveis: false,
    enabled: open,
  });

  const items = data?.data ?? [];
  const hasMore = !!data?.has_more;

  // Filtrar apenas produtos que são receitas (produtos com ingredientes)
  // Por enquanto, vamos mostrar todos os produtos e deixar o admin escolher
  // Se houver uma forma de identificar receitas, podemos filtrar aqui
  const receitas = items; // TODO: Filtrar receitas se houver campo específico

  const { vincularReceita } = useMutateVitrine();

  function handleAdd(cod_barras: string) {
    vincularReceita.mutate(
      { vitrineId, empresa_id: empresaId, cod_barras },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  React.useEffect(() => {
    if (!open) {
      setBusca("");
      setPage(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Adicionar receitas existentes à vitrine</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Buscar por nome ou código de barras..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPage(1);
            }}
            autoFocus
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-auto pr-1">
            {isLoading && (
              <div className="col-span-full text-sm text-muted-foreground">
                Carregando receitas...
              </div>
            )}

            {!isLoading && receitas.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">
                Nenhuma receita encontrada.
              </div>
            )}

            {receitas.map((p) => (
              <div
                key={p.cod_barras}
                className="border rounded-lg p-2 flex flex-col gap-2 hover:shadow-sm transition"
              >
                <div className="relative w-full h-24 bg-muted rounded overflow-hidden">
                  {p.imagem ? (
                    <Image src={p.imagem} alt={p.descricao} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium line-clamp-2">{p.descricao}</div>
                <div className="text-xs text-muted-foreground">{p.cod_barras}</div>
                <div className="text-sm font-semibold">
                  {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.preco_venda)}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => handleAdd(p.cod_barras)} 
                  disabled={vincularReceita.isPending}
                >
                  {vincularReceita.isPending ? "Adicionando..." : "Adicionar"}
                </Button>
              </div>
            ))}
          </div>

          {(receitas.length > 0 || page > 1) && (
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((n) => Math.max(1, n - 1))}
                disabled={isFetching || page === 1}
              >
                Anterior
              </Button>
              <div className="text-xs text-muted-foreground">Página {page}</div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((n) => n + 1)}
                disabled={isFetching || !hasMore}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

