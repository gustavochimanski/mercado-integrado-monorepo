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
import { useMutateVitrine } from "@cardapio/services/useQueryVitrine";
import Image from "next/image";
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useQuery } from "@tanstack/react-query";
import type { ComboDTO, ListaCombosResponse } from "@cardapio/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresaId: number;
  vitrineId: number;
}

function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const ModalNovoCombo = ({
  open,
  onOpenChange,
  empresaId,
  vitrineId,
}: Props) => {
  const [busca, setBusca] = React.useState("");
  const [page, setPage] = React.useState(1);
  const buscaDeb = useDebounced(busca, 350);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["combos_admin", empresaId, page, buscaDeb],
    queryFn: async () => {
      const params: Record<string, any> = { 
        cod_empresa: empresaId,
        page,
        limit: 30,
      };
      const { data } = await apiAdmin.get<ListaCombosResponse>("/api/cadastros/admin/combos/", { params });
      
      // Filtrar por busca se necessário (client-side por enquanto)
      let combos = data.data || [];
      if (buscaDeb?.trim()) {
        combos = combos.filter(c => 
          c.titulo.toLowerCase().includes(buscaDeb.toLowerCase()) ||
          c.descricao?.toLowerCase().includes(buscaDeb.toLowerCase())
        );
      }
      
      return { combos, hasMore: data.has_more };
    },
    enabled: open && !!empresaId,
    staleTime: 5 * 60 * 1000,
  });

  const combos = data?.combos || [];
  const hasMore = data?.hasMore ?? false;

  const { vincularCombo } = useMutateVitrine();

  function handleAdd(combo_id: number) {
    vincularCombo.mutate(
      { vitrineId, combo_id },
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
          <DialogTitle>Adicionar combos existentes à vitrine</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-auto pr-1">
            {isLoading && (
              <div className="col-span-full text-sm text-muted-foreground">
                Carregando combos...
              </div>
            )}

            {!isLoading && combos.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground">
                Nenhum combo encontrado.
              </div>
            )}

            {combos
              .filter(c => c.ativo) // Apenas combos ativos
              .map((combo) => (
                <div
                  key={combo.id}
                  className="border rounded-lg p-2 flex flex-col gap-2 hover:shadow-sm transition"
                >
                  <div className="relative w-full h-24 bg-muted rounded overflow-hidden">
                    {combo.imagem ? (
                      <Image src={combo.imagem} alt={combo.titulo} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium line-clamp-2">{combo.titulo}</div>
                  {combo.descricao && (
                    <div className="text-xs text-muted-foreground line-clamp-2">{combo.descricao}</div>
                  )}
                  <div className="text-sm font-semibold">
                    {Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(combo.preco_total)}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAdd(combo.id)} 
                    disabled={vincularCombo.isPending}
                  >
                    {vincularCombo.isPending ? "Adicionando..." : "Adicionar"}
                  </Button>
                </div>
              ))}
          </div>

          {combos.length > 0 && (
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

