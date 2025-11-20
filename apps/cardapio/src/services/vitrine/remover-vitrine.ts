// @cardapio/services/vitrine/remover-vitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

/**
 * Hook para remover uma vitrine
 * Endpoint: DELETE /api/cardapio/admin/vitrines/{vitrineId}
 * 
 * @example
 * ```tsx
 * const removerVitrine = useRemoverVitrine();
 * removerVitrine.mutate(123);
 * ```
 */
export function useRemoverVitrine() {
  const qc = useQueryClient();
  
  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
    qc.invalidateQueries({ queryKey: ["vitrines_search"], exact: false });
  };

  const reloadPage = () => {
    invalidateAll();
    window.location.reload();
  };

  return useMutation({
    mutationFn: async (vitrineId: number) => {
      await apiAdmin.delete(`/api/cardapio/admin/vitrines/${vitrineId}`);
    },
    onSuccess: () => {
      toast.success("Vitrine removida com sucesso!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao remover vitrine"));
    },
  });
}

