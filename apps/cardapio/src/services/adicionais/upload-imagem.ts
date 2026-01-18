// @cardapio/services/adicionais/upload-imagem.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { AdicionalResponse } from "@cardapio/api";

export interface UploadImagemAdicionalBody {
  adicional_id: number;
  cod_empresa: number;
  imagem: File;
}

/**
 * Hook para fazer upload de imagem de adicional
 * Endpoint: PUT /api/catalogo/admin/adicionais/{adicional_id}/imagem
 * 
 * @example
 * ```tsx
 * const uploadImagem = useUploadImagemAdicional();
 * uploadImagem.mutate({ adicional_id: 1, cod_empresa: 1, imagem: file });
 * ```
 */
export function useUploadImagemAdicional() {
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["adicionais"] });
    qc.invalidateQueries({ queryKey: ["adicionais-produto"] });
    qc.invalidateQueries({ queryKey: ["adicionais-receita"] });
    qc.invalidateQueries({ queryKey: ["adicionais-combo"] });
    qc.invalidateQueries({ queryKey: ["complementos"] });
  };

  return useMutation({
    mutationFn: ({ adicional_id, cod_empresa, imagem }: UploadImagemAdicionalBody): Promise<AdicionalResponse> => {
      const fd = new FormData();
      fd.append("cod_empresa", String(cod_empresa));
      fd.append("imagem", imagem);
      
      return apiAdmin.put<AdicionalResponse>(
        `/api/catalogo/admin/adicionais/${adicional_id}/imagem`,
        fd
      ).then((response) => response.data);
    },
    onSuccess: () => {
      toast.success("Imagem do adicional atualizada!");
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
