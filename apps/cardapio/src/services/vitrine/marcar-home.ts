// @cardapio/services/vitrine/marcar-home.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { VitrineOut } from "./types";

interface MarcarHomeParams {
  id: number;
  is_home: boolean;
}

/**
 * Hook para marcar/desmarcar vitrine como destaque da home
 * Endpoint: PATCH /api/cardapio/admin/vitrines/{id}/home
 * 
 * @example
 * ```tsx
 * const marcarHome = useMarcarHome();
 * marcarHome.mutate({ id: 1, is_home: true });
 * ```
 */
export function useMarcarHome() {
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
    mutationFn: async ({ id, is_home }: MarcarHomeParams) => {
      const { data } = await apiAdmin.patch(`/api/cardapio/admin/vitrines/${id}/home`, { is_home });
      return data as VitrineOut;
    },
    onSuccess: (v) => {
      toast.success(v.is_home ? "Vitrine marcada como destaque da Home!" : "Vitrine removida da Home.");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao atualizar destaque da vitrine"));
    },
  });
}

