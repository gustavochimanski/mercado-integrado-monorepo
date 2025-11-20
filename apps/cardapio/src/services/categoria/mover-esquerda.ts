// @cardapio/services/categoria/mover-esquerda.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

/**
 * Hook para mover categoria para a esquerda
 * Endpoint: POST /api/cardapio/admin/categorias/{id}/move-left
 * 
 * @example
 * ```tsx
 * const moverEsquerda = useMoverCategoriaEsquerda();
 * moverEsquerda.mutate(1);
 * ```
 */
export function useMoverCategoriaEsquerda() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
    qc.invalidateQueries({ queryKey: ["categorias_search"] });
  };

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };

  return useMutation({
    mutationFn: (id: number) => apiAdmin.post(`/api/cardapio/admin/categorias/${id}/move-left`),
    onSuccess: () => {
      toast.success("Categoria movida para a esquerda!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

