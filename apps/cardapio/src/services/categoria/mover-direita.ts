// @cardapio/services/categoria/mover-direita.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import { getEmpresaId } from "@cardapio/stores/empresa/empresaStore";

/**
 * Hook para mover categoria para a direita
 * Endpoint: POST /api/cardapio/admin/categorias/{id}/move-right
 * 
 * @example
 * ```tsx
 * const moverDireita = useMoverCategoriaDireita();
 * moverDireita.mutate(1);
 * ```
 */
export function useMoverCategoriaDireita() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categorias_planas"] });
    qc.invalidateQueries({ queryKey: ["categorias"] });
    qc.invalidateQueries({ queryKey: ["categorias_search"] });
  };

  const reloadPage = () => {
    invalidate();
    window.location.reload();
  };

  return useMutation({
    mutationFn: (id: number) => {
      const codEmpresa = getEmpresaId();
      return apiAdmin.post(`/api/cardapio/admin/categorias/${id}/move-right`, undefined, {
        params: { cod_empresa: codEmpresa },
      });
    },
    onSuccess: () => {
      toast.success("Categoria movida para a direita!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

