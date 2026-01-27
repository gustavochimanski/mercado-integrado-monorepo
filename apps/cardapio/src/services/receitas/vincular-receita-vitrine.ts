// @cardapio/services/receitas/vincular-receita-vitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";
import { useLandingpageTrue } from "../vitrine/utils";

interface VincularReceitaVitrineParams {
  vitrineId: number;
  receita_id: number;
}

/**
 * Hook para vincular uma receita a uma vitrine
 * Endpoint: POST /api/cardapio/admin/vitrines/{vitrineId}/vincular-receita
 * 
 * @example
 * ```tsx
 * const vincularReceita = useVincularReceitaVitrine();
 * vincularReceita.mutate({ vitrineId: 1, receita_id: 123 });
 * ```
 */
export function useVincularReceitaVitrine() {
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
    mutationFn: async (params: VincularReceitaVitrineParams) => {
      const empresaId = getEmpresaId();
      await apiAdmin.post(
        `/api/cardapio/admin/vitrines/${params.vitrineId}/vincular-receita`,
        { receita_id: params.receita_id },
        { params: { empresa_id: empresaId, ...(landingpageTrue ? { landingpage_true: true } : {}) } }
      );
    },
    onSuccess: () => {
      toast.success("Receita vinculada!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao vincular receita"));
    },
  });
}

