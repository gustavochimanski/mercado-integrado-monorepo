// @cardapio/services/categoria/atualizar-categoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { UpdateCategoriaBody } from "./types";

/**
 * Hook para atualizar uma categoria
 * Endpoint: PUT /api/cardapio/admin/categorias/{id}
 * 
 * @example
 * ```tsx
 * const atualizarCategoria = useAtualizarCategoria();
 * atualizarCategoria.mutate({ id: 1, descricao: "Pizzas Especiais", cod_empresa: 1 });
 * ```
 */
export function useAtualizarCategoria() {
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
    mutationFn: ({ id, ...body }: UpdateCategoriaBody) =>
      apiAdmin.put(`/api/cardapio/admin/categorias/${id}`, body),
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

