// @cardapio/services/vitrine/desvincular-combo.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "./utils";

interface DesvincularComboParams {
  vitrineId: number;
  combo_id: number;
}

/**
 * Hook para desvincular um combo de uma vitrine
 * Endpoint: DELETE /api/cardapio/admin/vitrines/{vitrineId}/vincular-combo/{combo_id}
 * 
 * @example
 * ```tsx
 * const desvincularCombo = useDesvincularCombo();
 * desvincularCombo.mutate({ vitrineId: 1, combo_id: 123 });
 * ```
 */
export function useDesvincularCombo() {
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
    mutationFn: async (p: DesvincularComboParams) => {
      const empresaId = getEmpresaId();
      await apiAdmin.delete(
        `/api/cardapio/admin/vitrines/${p.vitrineId}/vincular-combo/${p.combo_id}`,
        { params: { empresa_id: empresaId, ...(landingpageTrue ? { landingpage_true: true } : {}) } }
      );
    },
    onSuccess: () => {
      toast.success("Combo desvinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao desvincular combo"));
    },
  });
}

