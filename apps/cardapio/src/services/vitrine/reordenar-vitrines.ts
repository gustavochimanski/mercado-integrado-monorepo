// @cardapio/services/vitrine/reordenar-vitrines.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "./utils";

export type ReordenarVitrinesItem = { id: number; ordem: number };

/**
 * Reordena vitrines em lote (atualiza apenas `ordem`).
 * Faz N requests (uma por vitrine) e ao final invalida cache + recarrega.
 */
export function useReordenarVitrines() {
  const qc = useQueryClient();
  const landingpageTrue = useLandingpageTrue();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["vitrines"], exact: false });
    qc.invalidateQueries({ queryKey: ["vitrines_search"], exact: false });
  };

  return useMutation({
    mutationFn: async (items: ReordenarVitrinesItem[]) => {
      const empresaId = getEmpresaId();
      const params = { empresa_id: empresaId, ...(landingpageTrue ? { landingpage_true: true } : {}) };

      // ordem começa em 1 (ou o que vier do caller)
      for (const it of items) {
        await apiAdmin.put(`/api/cardapio/admin/vitrines/${it.id}`, { ordem: it.ordem }, { params });
      }
    },
    onSuccess: () => {
      toast.success("Ordem das vitrines atualizada!");
      invalidateAll();
      window.location.reload();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao reordenar vitrines"));
    },
  });
}

