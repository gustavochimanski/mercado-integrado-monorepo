// @cardapio/services/vitrine/desvincular-produto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

interface DesvincularProdutoParams {
  vitrineId: number;
  empresa_id: number;
  cod_barras: string;
}

/**
 * Hook para desvincular um produto de uma vitrine
 * Endpoint: DELETE /api/cardapio/admin/vitrines/{vitrineId}/vincular/{cod_barras}
 * 
 * @example
 * ```tsx
 * const desvincularProduto = useDesvincularProduto();
 * desvincularProduto.mutate({ vitrineId: 1, empresa_id: 1, cod_barras: "123" });
 * ```
 */
export function useDesvincularProduto() {
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
    mutationFn: async (p: DesvincularProdutoParams) => {
      await apiAdmin.delete(
        `/api/cardapio/admin/vitrines/${p.vitrineId}/vincular/${encodeURIComponent(p.cod_barras)}`,
        { params: { empresa_id: p.empresa_id } }
      );
    },
    onSuccess: () => {
      toast.success("Produto desvinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao desvincular produto"));
    },
  });
}

