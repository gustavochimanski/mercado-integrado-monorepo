// @cardapio/services/vitrine/atualizar-vitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { CreateVitrineDTO, CreateVitrinePayload, VitrineOut } from "./types";

/**
 * Hook para atualizar uma vitrine existente
 * Endpoint: PUT /api/cardapio/admin/vitrines/{id}
 * 
 * @example
 * ```tsx
 * const atualizarVitrine = useAtualizarVitrine();
 * atualizarVitrine.mutate({ id: 1, titulo: "Novo título" });
 * ```
 */
export function useAtualizarVitrine() {
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
    mutationFn: async ({ id, ...body }: { id: number } & Partial<CreateVitrineDTO>) => {
      const payload: Partial<CreateVitrinePayload> = {
        ...(typeof body.cod_categoria === "number" ? { cod_categoria: body.cod_categoria } : {}),
        ...(typeof body.titulo === "string" ? { titulo: body.titulo } : {}),
        ...(typeof body.ordem === "number" ? { ordem: body.ordem } : {}),
        ...(typeof body.is_home === "boolean" ? { is_home: body.is_home } : {}),
      };
      const { data } = await apiAdmin.put(`/api/cardapio/admin/vitrines/${id}`, payload);
      return data as VitrineOut;
    },
    onSuccess: () => {
      toast.success("Vitrine atualizada!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao atualizar vitrine"));
    },
  });
}

