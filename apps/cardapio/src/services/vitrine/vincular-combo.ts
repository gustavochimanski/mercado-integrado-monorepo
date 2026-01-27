// @cardapio/services/vitrine/vincular-combo.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "./utils";

interface VincularComboParams {
  vitrineId: number;
  combo_id: number;
}

/**
 * Hook para vincular um combo a uma vitrine
 * Endpoint: POST /api/cardapio/admin/vitrines/{vitrineId}/vincular-combo
 * 
 * @example
 * ```tsx
 * const vincularCombo = useVincularCombo();
 * vincularCombo.mutate({ vitrineId: 1, combo_id: 123 });
 * ```
 */
export function useVincularCombo() {
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
    mutationFn: async (p: VincularComboParams) => {
      const empresaId = getEmpresaId();
      await apiAdmin.post(
        `/api/cardapio/admin/vitrines/${p.vitrineId}/vincular-combo`,
        { combo_id: p.combo_id },
        { params: { empresa_id: empresaId, ...(landingpageTrue ? { landingpage_true: true } : {}) } }
      );
    },
    onSuccess: () => {
      toast.success("Combo vinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao vincular combo"));
    },
  });
}

