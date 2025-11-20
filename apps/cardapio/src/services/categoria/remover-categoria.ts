// @cardapio/services/categoria/remover-categoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

/**
 * Hook para remover uma categoria
 * Endpoint: DELETE /api/cardapio/admin/categorias/{id}
 * 
 * @example
 * ```tsx
 * const removerCategoria = useRemoverCategoria();
 * removerCategoria.mutate(1);
 * ```
 */
export function useRemoverCategoria() {
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
    mutationFn: (id: number) => apiAdmin.delete(`/api/cardapio/admin/categorias/${id}`),
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

