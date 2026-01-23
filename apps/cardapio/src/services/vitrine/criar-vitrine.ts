// @cardapio/services/vitrine/criar-vitrine.ts
import apiAdmin from "@cardapio/app/api/apiAdmin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractErrorMessage } from "@cardapio/lib/extractErrorMessage";
import type { CreateVitrineDTO, CreateVitrinePayload, VitrineOut } from "./types";

/**
 * Hook para criar uma nova vitrine
 * Endpoint: POST /api/cardapio/admin/vitrines/
 * 
 * @example
 * ```tsx
 * const criarVitrine = useCriarVitrine();
 * criarVitrine.mutate({ cod_categoria: 1, titulo: "Promoções" });
 * ```
 */
export function useCriarVitrine() {
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
    mutationFn: async (body: CreateVitrineDTO) => {
      const payload: CreateVitrinePayload = {
        cod_categoria: body.cod_categoria,
        titulo: body.titulo,
        ...(typeof body.is_home === "boolean" ? { is_home: body.is_home } : {}),
      };
      const { data } = await apiAdmin.post("/api/cardapio/admin/vitrines/", payload);
      return data as VitrineOut;
    },
    onSuccess: () => {
      toast.success("Vitrine criada com sucesso!");
      reloadPage();
    },
    onError: (err: any) => {
      toast.error(extractErrorMessage(err, "Erro ao criar vitrine"));
    },
  });
}

