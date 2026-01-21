// @cardapio/services/complementos/vincular-complementos-receita.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { VincularComplementosRequest, VincularComplementosRequestSimples } from "@cardapio/types/complementos";

/**
 * Parâmetros para vincular complementos a uma receita
 */
export interface VincularComplementosReceitaParams {
  receita_id: number;
  request: VincularComplementosRequest | VincularComplementosRequestSimples;
}

/**
 * Hook para vincular complementos a uma receita
 * Endpoint: POST /api/catalogo/admin/receitas/{receita_id}/complementos
 * 
 * Suporta dois formatos:
 * 1. Formato completo (recomendado): com `configuracoes` contendo todas as configurações
 * 2. Formato simples (compatibilidade): com `complemento_ids` e `ordens`
 * 
 * @example
 * ```tsx
 * // Formato completo (recomendado)
 * const vincularComplementos = useVincularComplementosReceita();
 * vincularComplementos.mutate({
 *   receita_id: 1,
 *   request: {
 *     configuracoes: [
 *       {
 *         complemento_id: 1,
 *         ordem: 0,
 *         obrigatorio: true,
 *         quantitativo: false,
 *         minimo_itens: 1,
 *         maximo_itens: 3
 *       }
 *     ]
 *   }
 * });
 * 
 * // Formato simples (compatibilidade)
 * vincularComplementos.mutate({
 *   receita_id: 1,
 *   request: {
 *     complemento_ids: [1, 2, 3],
 *     ordens: [0, 1, 2]
 *   }
 * });
 * ```
 */
export function useVincularComplementosReceita() {
  const qc = useQueryClient();
  
  const invalidateQueries = () => {
    qc.invalidateQueries({ queryKey: ["complementos-unificado"], exact: false });
    qc.invalidateQueries({ queryKey: ["receitas"], exact: false });
    qc.invalidateQueries({ queryKey: ["complementos"], exact: false });
  };

  return useMutation({
    mutationFn: async (params: VincularComplementosReceitaParams) => {
      await apiAdmin.post(
        `/api/catalogo/admin/receitas/${params.receita_id}/complementos`,
        params.request
      );
    },
    onSuccess: () => {
      toast.success("Complementos vinculados com sucesso!");
      invalidateQueries();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao vincular complementos"));
    },
  });
}
