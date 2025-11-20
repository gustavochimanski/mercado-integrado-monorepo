// @cardapio/services/categoria/upload-imagem.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { UploadImagemBody } from "./types";

/**
 * Hook para fazer upload de imagem de categoria
 * Endpoint: PATCH /api/cardapio/admin/categorias/{id}/imagem
 * 
 * @example
 * ```tsx
 * const uploadImagem = useUploadImagemCategoria();
 * uploadImagem.mutate({ id: 1, cod_empresa: 1, imagem: file });
 * ```
 */
export function useUploadImagemCategoria() {
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
    mutationFn: ({ id, cod_empresa, imagem }: UploadImagemBody) => {
      const fd = new FormData();
      fd.append("cod_empresa", String(cod_empresa));
      fd.append("imagem", imagem);
      return apiAdmin.patch(`/api/cardapio/admin/categorias/${id}/imagem`, fd);
    },
    onSuccess: () => {
      toast.success("Imagem atualizada!");
      reloadPage();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

