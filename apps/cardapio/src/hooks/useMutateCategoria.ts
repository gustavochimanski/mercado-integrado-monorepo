// src/hooks/useMutateCategoria.ts
import { api } from "@cardapio/app/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NovoBody {
  descricao: string;
  slug?: string;
  imagem?: File;
}

export function useMutateCategoria(parentSlug: string | null) {
  const qc = useQueryClient();

  function buildFormData({ descricao, slug, imagem }: NovoBody) {
    const fd = new FormData();
    fd.append("descricao", descricao.trim());
    if (slug) fd.append("slug", slug);
    fd.append("slug_pai", parentSlug ?? "");
    if (imagem) fd.append("imagem", imagem);
    return fd;
  }

  const createSub = useMutation({
    mutationFn: (body: NovoBody) =>
      api.post("/mensura/categorias/delivery", buildFormData(body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/mensura/categorias/delivery/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categorias_planas"] });
      qc.invalidateQueries({ queryKey: ["categorias"] });
    },
  });

  return { createSub, remove };
}
