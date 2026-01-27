// @cardapio/services/receitas/desvincular-receita-vitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "../vitrine/utils";

interface DesvincularReceitaVitrineParams {
  vitrineId: number;
  receita_id: number;
}

/**
 * Hook para desvincular uma receita de uma vitrine
 * Endpoint: DELETE /api/cardapio/admin/vitrines/{vitrineId}/vincular-receita/{receita_id}
 * 
 * @example
 * ```tsx
 * const desvincularReceita = useDesvincularReceitaVitrine();
 * desvincularReceita.mutate({ vitrineId: 1, receita_id: 123 });
 * ```
 */
export function useDesvincularReceitaVitrine() {
  const qc = useQueryClient();
  const landingpageTrue = useLandingpageTrue();
  
  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
    qc.invalidateQueries({ queryKey: ["vitrines_search"], exact: false });
  };

  const reloadPage = () => {
    invalidateAll();
    window.location.reload();
  };

  return useMutation({
    mutationFn: async (p: DesvincularReceitaVitrineParams) => {
      const empresaId = getEmpresaId();
      await apiAdmin.delete(
        `/api/cardapio/admin/vitrines/${p.vitrineId}/vincular-receita/${p.receita_id}`,
        { params: { empresa_id: empresaId, ...(landingpageTrue ? { landingpage_true: true } : {}) } }
      );
    },
    onSuccess: () => {
      toast.success("Receita desvinculada!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao desvincular receita"));
    },
  });
}
