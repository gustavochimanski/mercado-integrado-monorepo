// @cardapio/services/vitrine/vincular-produto.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";

interface VincularProdutoParams {
  vitrineId: number;
  empresa_id: number;
  cod_barras: string;
}

/**
 * Hook para vincular um produto a uma vitrine
 * Endpoint: POST /api/cardapio/admin/vitrines/{vitrineId}/vincular
 * 
 * @example
 * ```tsx
 * const vincularProduto = useVincularProduto();
 * vincularProduto.mutate({ vitrineId: 1, empresa_id: 1, cod_barras: "123" });
 * ```
 */
export function useVincularProduto() {
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
    mutationFn: async (p: VincularProdutoParams) => {
      await apiAdmin.post(`/api/cardapio/admin/vitrines/${p.vitrineId}/vincular`, {
        empresa_id: p.empresa_id,
        cod_barras: p.cod_barras,
      });
    },
    onSuccess: () => {
      toast.success("Produto vinculado!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao vincular produto"));
    },
  });
}

