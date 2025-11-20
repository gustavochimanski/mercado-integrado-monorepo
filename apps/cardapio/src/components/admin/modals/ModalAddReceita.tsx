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
import { useVincularReceitaVitrine } from "@cardapio/services/receitas/vincular-receita-vitrine";
import { useListarReceitas } from "@cardapio/services/receitas/listar-receitas";
import Image from "next/image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  vitrineId: number;
}

export const ModalAddReceita = ({
  open,
  onOpenChange,
  empresaId,
  vitrineId,
}: Props) => {
  const [busca, setBusca] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isFetching } = useListarReceitas(empresaId, {
    page,
    limit: 30,
    q: busca,
    enabled: open && !!empresaId,
  });

  const receitas = data?.receitas || [];
  const hasMore = data?.hasMore ?? false;

  const vincularReceita = useVincularReceitaVitrine();

  function handleAdd(receita_id: number) {
    vincularReceita.mutate(
      { vitrineId, receita_id },
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
            onChange={(e) => setBusca(e.target.value)}
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

            {receitas
              .filter(r => r.ativo) // Apenas receitas ativas
              .map((receita) => (
                <div
                  key={receita.id}
                  className="border rounded-lg p-2 flex flex-col gap-2 hover:shadow-sm transition"
                >
                  <div className="relative w-full h-24 bg-muted rounded overflow-hidden">
                    {receita.imagem ? (
                      <Image src={receita.imagem} alt={receita.descricao} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium line-clamp-2">{receita.nome || receita.descricao}</div>
                  {receita.descricao && receita.descricao !== receita.nome && (
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {receita.descricao}
                    </div>
                  )}
                  <div className="text-sm font-semibold">
                    {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(receita.preco_venda)}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAdd(receita.receita_id || receita.id)} 
                    disabled={vincularReceita.isPending}
                  >
                    {vincularReceita.isPending ? "Adicionando..." : "Adicionar"}
                  </Button>
                </div>
              ))}
          </div>

          {receitas.length > 0 && (
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
