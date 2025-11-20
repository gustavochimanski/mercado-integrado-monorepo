// @cardapio/services/categoria/criar-categoria.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { CreateCategoriaBody } from "./types";

/**
 * Hook para criar uma nova categoria
 * Endpoint: POST /api/cardapio/admin/categorias/
 * 
 * @example
 * ```tsx
 * const criarCategoria = useCriarCategoria();
 * criarCategoria.mutate({ descricao: "Pizzas", cod_empresa: 1 });
 * ```
 */
export function useCriarCategoria() {
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
    mutationFn: (body: CreateCategoriaBody) => apiAdmin.post("/api/cardapio/admin/categorias/", body),
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

